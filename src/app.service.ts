import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  private bank = new Map<string, number>();
  private wallets = new Map<string, Map<string, number>>();
  private log: { type: 'buy' | 'sell'; wallet_id: string; stock_name: string }[] = [];

  buySell(walletId: string, stockName: string, type: 'buy' | 'sell') {
    if (!this.bank.has(stockName)) {
      throw new NotFoundException('Stock does not exist');
    }

    const bankQuantity = this.bank.get(stockName)!;

    if (!this.wallets.has(walletId)) {
      this.wallets.set(walletId, new Map());
    }

    const wallet = this.wallets.get(walletId)!;
    const walletQuantity = wallet.get(stockName) || 0;

    if (type === 'buy') {
      if (bankQuantity <= 0) {
        throw new BadRequestException('No stock in bank');
      }

      this.bank.set(stockName, bankQuantity - 1);
      wallet.set(stockName, walletQuantity + 1);
    }

    if (type === 'sell') {
      if (walletQuantity <= 0) {
        throw new BadRequestException('No stock in wallet');
      }

      this.bank.set(stockName, bankQuantity + 1);
      wallet.set(stockName, walletQuantity - 1);
    }

    this.log.push({
      type,
      wallet_id: walletId,
      stock_name: stockName,
    });
  }

  getWallet(walletId: string) {
    const wallet = this.wallets.get(walletId);

    if (!wallet) {
      return { id: walletId, stocks: [] };
    }

    const stocks = Array.from(wallet.entries()).map(([name, quantity]) => ({
      name,
      quantity,
    }));

    return { id: walletId, stocks };
  }

  getWalletStock(walletId: string, stockName: string) {
    const wallet = this.wallets.get(walletId);

    if (!wallet) return 0;

    return wallet.get(stockName) || 0;
  }

  getStocks() {
    const stocks = Array.from(this.bank.entries()).map(([name, quantity]) => ({
      name,
      quantity,
    }));

    return { stocks };
  }

  setStocks(stocks: { name: string; quantity: number }[]) {
    this.bank.clear();

    for (const stock of stocks) {
      this.bank.set(stock.name, stock.quantity);
    }
  }

  getLog() {
    return { log: this.log };
  }
}
