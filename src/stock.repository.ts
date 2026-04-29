import { Injectable } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Injectable()
export class StockRepository {
    constructor(private readonly redisService: RedisService) { }

    private get redis() {
        return this.redisService.getClient();
    }

    async getBankStock(stockName: string): Promise<number | null> {
        const val = await this.redis.hget('bank:stocks', stockName);
        return val === null ? null : Number(val);
    }

    async incrementBankStock(stockName: string, delta: number) {
        await this.redis.hincrby('bank:stocks', stockName, delta);
    }

    async getWalletStock(walletId: string, stockName: string) {
        const val = await this.redis.hget(`wallet:${walletId}`, stockName);
        return Number(val || 0);
    }

    async incrementWalletStock(walletId: string, stockName: string, delta: number) {
        await this.redis.hincrby(`wallet:${walletId}`, stockName, delta);
    }

    async pushLog(entry: any) {
        await this.redis.rpush('audit:log', JSON.stringify(entry));
        await this.redis.ltrim('audit:log', -10000, -1);
    }

    async getWallet(walletId: string) {
        const data = await this.redis.hgetall(`wallet:${walletId}`);

        const stocks = Object.entries(data).map(([name, quantity]) => ({
            name,
            quantity: Number(quantity),
        }));

        return { id: walletId, stocks };
    }

    async getStocks() {
        const data = await this.redis.hgetall('bank:stocks');

        const stocks = Object.entries(data).map(([name, quantity]) => ({
            name,
            quantity: Number(quantity),
        }));

        return { stocks };
    }

    async setStocks(stocks: { name: string; quantity: number }[]) {
        await this.redis.del('bank:stocks');

        for (const stock of stocks) {
            await this.redis.hset('bank:stocks', stock.name, stock.quantity);
        }
    }

    async getLog() {
        const entries = await this.redis.lrange('audit:log', 0, -1);

        return {
            log: entries.map((e) => JSON.parse(e)),
        };
    }
}