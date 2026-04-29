import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  buySell(walletId: string, stockName: string, type: 'buy' | 'sell') {

  }

  getWallet(walletId: string) {

  }

  getWalletStock(walletId: string, stockName: string) {

  }

  getStocks() {

  }

  setStocks(stocks: any[]) {

  }

  getLog() {

  }
}
