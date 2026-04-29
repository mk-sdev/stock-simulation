import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseStockNamePipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Invalid stock_name');
    }
    return value;
  }
}