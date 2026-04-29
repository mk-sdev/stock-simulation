import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { RedisService } from './redis.service';
import { StockRepository } from './stock.repository';

@Module({
  imports: [],
  controllers: [StockController],
  providers: [StockService, RedisService, StockRepository],
})
export class StockModule { }
