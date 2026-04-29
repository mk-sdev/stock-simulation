import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseWalletIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException('Invalid wallet_id');
    }
    return value;
  }
}