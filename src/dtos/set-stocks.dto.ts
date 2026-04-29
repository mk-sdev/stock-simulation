import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StockDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  quantity: number;
}

export class SetStocksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockDto)
  stocks: StockDto[];
}