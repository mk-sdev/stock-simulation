import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BuySellDto } from './dtos/buy-sell.dto';
import { SetStocksDto } from './dtos/set-stocks.dto';
import { StockService } from './stock.service';
import { ParseStockNamePipe } from './pipes/parse-stock-name-pipe';
import { ParseWalletIdPipe } from './pipes/parse-wallet-id-pipe';

@Controller()
@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
}))
export class StockController {
  constructor(
    private readonly appService: StockService,
  ) { }

  @Post('wallets/:wallet_id/stocks/:stock_name')
  async buySellStock(
    @Param('wallet_id', ParseWalletIdPipe) walletId: string,
    @Param('stock_name', ParseStockNamePipe) stockName: string,
    @Body() body: BuySellDto,
  ) {
    await this.appService.buySell(walletId, stockName, body.type);
    return { status: 'ok' };
  }

  @Get('wallets/:wallet_id')
  async getWallet(
    @Param('wallet_id', ParseWalletIdPipe) walletId: string,
  ) {
    return this.appService.getWallet(walletId);
  }

  @Get('wallets/:wallet_id/stocks/:stock_name')
  async getWalletStock(
    @Param('wallet_id', ParseWalletIdPipe) walletId: string,
    @Param('stock_name', ParseStockNamePipe) stockName: string,
  ) {
    return this.appService.getWalletStock(walletId, stockName);
  }

  @Get('stocks')
  async getStocks() {
    return this.appService.getStocks();
  }

  @Post('stocks')
  async setStocks(@Body() dto: SetStocksDto) {
    await this.appService.setStocks(dto.stocks);
    return { status: 'ok' };
  }

  @Get('log')
  async getLog() {
    return this.appService.getLog();
  }

  @Post('/chaos')
  chaos() {
    setTimeout(() => process.exit(1), 100);
    return { message: 'Instance will terminate' };
  }

  // TODO: remove before production
  @Get('health')
  health() {
    return { status: 'OK' };
  }
}