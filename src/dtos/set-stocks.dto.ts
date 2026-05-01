import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Matches, Min, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class StockDto {
  @Transform(({ value }: { value: string }) => value?.trim().toUpperCase())
  @IsString()
  @Matches(/^[A-Z]+$/) // only letters, capitalization doesnt matter as we transform to uppercase
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  quantity: number;
}

export class SetStocksDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StockDto)
  stocks: StockDto[];
}