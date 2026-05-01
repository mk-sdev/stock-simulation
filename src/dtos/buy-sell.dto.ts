import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

export class BuySellDto {
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @IsIn(['buy', 'sell'])
  type: 'buy' | 'sell';
}