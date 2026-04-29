import { IsIn } from 'class-validator';

export class BuySellDto {
  @IsIn(['buy', 'sell'])
  type: 'buy' | 'sell';
}