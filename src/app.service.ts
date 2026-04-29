import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) { }

  async buySell(walletId: string, stockName: string, type: 'buy' | 'sell') {
    const redis = this.redisService.getClient();

    const bankQtyRaw = await redis.hget('bank:stocks', stockName);

    if (bankQtyRaw === null) {
      throw new NotFoundException('Stock does not exist');
    }

    const bankQty = Number(bankQtyRaw);
    const walletKey = `wallet:${walletId}`;
    const walletQty = Number(await redis.hget(walletKey, stockName) || 0);

    if (type === 'buy') {
      if (bankQty <= 0) {
        throw new BadRequestException('No stock in bank');
      }

      await redis.hincrby('bank:stocks', stockName, -1);
      await redis.hincrby(walletKey, stockName, 1);
    }

    if (type === 'sell') {
      if (walletQty <= 0) {
        throw new BadRequestException('No stock in wallet');
      }

      await redis.hincrby('bank:stocks', stockName, 1);
      await redis.hincrby(walletKey, stockName, -1);
    }

    await redis.rpush(
      'audit:log',
      JSON.stringify({
        type,
        wallet_id: walletId,
        stock_name: stockName,
        timestamp: Date.now(),
      }),
    );

    await redis.ltrim('audit:log', -10000, -1);
  }

  async getWallet(walletId: string) {
    const redis = this.redisService.getClient();

    const data = await redis.hgetall(`wallet:${walletId}`);

    const stocks = Object.entries(data).map(([name, quantity]) => ({
      name,
      quantity: Number(quantity),
    }));

    return { id: walletId, stocks };
  }

  async getWalletStock(walletId: string, stockName: string) {
    const redis = this.redisService.getClient();

    const val = await redis.hget(`wallet:${walletId}`, stockName);
    return Number(val || 0);
  }

  async getStocks() {
    const redis = this.redisService.getClient();

    const data = await redis.hgetall('bank:stocks');

    const stocks = Object.entries(data).map(([name, quantity]) => ({
      name,
      quantity: Number(quantity),
    }));

    return { stocks };
  }

  async setStocks(stocks: { name: string; quantity: number }[]) {
    const redis = this.redisService.getClient();

    await redis.del('bank:stocks');

    for (const stock of stocks) {
      await redis.hset('bank:stocks', stock.name, stock.quantity);
    }
  }

  async getLog() {
    const redis = this.redisService.getClient();

    const entries = await redis.lrange('audit:log', 0, -1);

    return {
      log: entries.map((e) => JSON.parse(e)),
    };
  }
}
