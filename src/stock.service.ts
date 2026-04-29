import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StockRepository } from './stock.repository';

@Injectable()
export class StockService {
  constructor(private readonly repo: StockRepository) { }

  async buySell(walletId: string, stockName: string, type: 'buy' | 'sell') {
    const bankQty = await this.repo.getBankStock(stockName);

    if (bankQty === null) {
      throw new NotFoundException('Stock does not exist');
    }

    const walletQty = await this.repo.getWalletStock(walletId, stockName);

    if (type === 'buy') {
      if (bankQty <= 0) {
        throw new BadRequestException('No stock in bank');
      }

      await this.repo.incrementBankStock(stockName, -1);
      await this.repo.incrementWalletStock(walletId, stockName, 1);
    }

    if (type === 'sell') {
      if (walletQty <= 0) {
        throw new BadRequestException('No stock in wallet');
      }

      await this.repo.incrementBankStock(stockName, 1);
      await this.repo.incrementWalletStock(walletId, stockName, -1);
    }

    await this.repo.pushLog({
      type,
      wallet_id: walletId,
      stock_name: stockName,
    });
  }

  async getWallet(walletId: string) {
    return this.repo.getWallet(walletId);
  }

  async getWalletStock(walletId: string, stockName: string) {
    return this.repo.getWalletStock(walletId, stockName);
  }

  async getStocks() {
    return this.repo.getStocks();
  }

  async setStocks(stocks: { name: string; quantity: number }[]) {
    await this.repo.setStocks(stocks);
  }

  async getLog() {
    return this.repo.getLog();
  }
}