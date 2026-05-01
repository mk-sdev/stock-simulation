import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseStockNamePipe implements PipeTransform<string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid stock_name');
    }

    const normalized = value.trim().toUpperCase();

    if (normalized.length === 0) {
      throw new BadRequestException('Invalid stock_name');
    }

    if (!/^[A-Z]+$/.test(normalized)) {
      throw new BadRequestException('Stock name must contain only letters');
    }

    return normalized;
  }
}