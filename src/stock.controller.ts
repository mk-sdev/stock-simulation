import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BuySellDto } from './dtos/buy-sell.dto';
import { SetStocksDto } from './dtos/set-stocks.dto';
import { StockService } from './stock.service';
import { ParseStockNamePipe } from './pipes/parse-stock-name.pipe';
import { ParseWalletIdPipe } from './pipes/parse-wallet-id.pipe';

@Controller()
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
}))
export class StockController {
  constructor(
    private readonly stockService: StockService,
  ) { }

  @Post('wallets/:wallet_id/stocks/:stock_name')
  @HttpCode(200)
  async buySellStock(
    @Param('wallet_id', ParseWalletIdPipe) walletId: string,
    @Param('stock_name', ParseStockNamePipe) stockName: string,
    @Body() body: BuySellDto,
  ) {
    await this.stockService.buySell(walletId, stockName, body.type);
    return { status: 'ok' };
  }

  @Get('wallets/:wallet_id')
  async getWallet(
    @Param('wallet_id', ParseWalletIdPipe) walletId: string,
  ) {
    return this.stockService.getWallet(walletId);
  }

  @Get('wallets/:wallet_id/stocks/:stock_name')
  async getWalletStock(
    @Param('wallet_id', ParseWalletIdPipe) walletId: string,
    @Param('stock_name', ParseStockNamePipe) stockName: string,
  ) {
    return this.stockService.getWalletStock(walletId, stockName);
  }

  @Get('stocks')
  async getStocks() {
    return this.stockService.getStocks();
  }

  @Post('stocks')
  @HttpCode(200)
  async setStocks(@Body() dto: SetStocksDto) {
    await this.stockService.setStocks(dto.stocks);
    return { status: 'ok' };
  }

  @Get('log')
  async getLog() {
    return this.stockService.getLog();
  }

  @Post('/chaos')
  @HttpCode(200)
  chaos() {
    setTimeout(() => process.exit(1), 100);
    return { message: 'Instance will terminate' };
  }
}