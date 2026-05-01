import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from '../stock.controller';
import { StockService } from '../stock.service';
import { BuySellDto } from "./buy-sell.dto";
import { SetStocksDto } from "./set-stocks.dto";


describe('DTOs validation', () => {
  let controller: StockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: StockService,
          useValue: {},
        },
      ],
    })
      .compile();

    controller = module.get<StockController>(StockController);
  });

  describe('BuySellDto validation test', () => {
    const validationPipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    });

    const invalidDtos = [
      {}, //#1 no type
      { type: '' }, //#2 empty
      { type: '   ' }, //#3 only spaces
      { type: null }, //#4 null value
      { type: undefined }, //#5 undefined value
      { type: 12345678 }, //#6 invalid type (number)
      { type: {} }, //#7 invalid type (object)
      { type: 'sell', additional: 1 }, //#8 extra attribute
      { type: 'exchange' }, //#9 wrong value
    ];

    invalidDtos.forEach((dto, index) => {
      it(`should throw validation error for invalid DTO #${index + 1}`, async () => {
        await expect(
          validationPipe.transform(dto, {
            type: 'body',
            metatype: BuySellDto,
          }),
        ).rejects.toThrow();
      });
    });

    const validDtos = [
      { type: 'buy' },
      { type: 'sell' },
      { type: 'BUY' },
      { type: 'Sell' },
      { type: '  buy  ' },
    ];

    validDtos.forEach((dto, index) => {

      it(`should pass validation for valid DTOs #${index + 1}`, async () => {

        await expect(
          validationPipe.transform(dto, {
            type: 'body',
            metatype: BuySellDto,
          }),
        ).resolves.toBeDefined();

      });
    })
  });

  describe('SetStocksDto validation test', () => {
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    const invalidDtos = [
      {}, //#1 missing stocks
      { stocks: null }, //#2 null
      { stocks: undefined }, //#3 undefined
      { stocks: 'not-an-array' }, //#4 wrong type
      { stocks: {} }, //#5 not an array
      { stocks: [] }, //#6 empty array
      { stocks: [{ name: '', quantity: 10 }] }, //#7 empty name
      { stocks: [{ name: '   ', quantity: 10 }] }, //#8 spaces
      { stocks: [{ name: '123', quantity: 10 }] }, //#9 wrong name
      { stocks: [{ name: 123, quantity: 10 }] }, //#10 wrong type name
      { stocks: [{ quantity: 10 }] }, //#11 missing name
      { stocks: [{ name: 'AAPL' }] }, //#12 missing quantity
      { stocks: [{ name: 'AAPL', quantity: -1 }] }, //#13 negative quantity
      { stocks: [{ name: 'AAPL', quantity: '10' }] }, //#14 wrong type quantity
      { stocks: [{ name: 'AAPL', quantity: 10.1 }] }, //#15 wrong type quantity
      { stocks: [{ name: 'AAPL', quantity: 10, extra: 'x' }] }, //#16 extra field in nested object
      { stocks: [{ name: 'AAPL', quantity: 10 }], extra: 'x' }, //#17 extra field in root
    ];

    invalidDtos.forEach((dto, index) => {
      it(`should throw validation error for invalid DTO #${index + 1}`, async () => {
        await expect(
          validationPipe.transform(dto, {
            type: 'body',
            metatype: SetStocksDto,
          }),
        ).rejects.toThrow();
      });
    });

    const validDtos = [
      { stocks: [{ name: 'AAPL', quantity: 10 }] },
      { stocks: [{ name: ' AAPL  ', quantity: 10 }] },
      { stocks: [{ name: 'aapl', quantity: 10 }] },
      { stocks: [{ name: 'aApl', quantity: 10 }] }
    ];

    validDtos.forEach((dto, index) => {

      it(`should pass validation for valid DTOs #${index + 1}`, async () => {

        await expect(
          validationPipe.transform(dto, {
            type: 'body',
            metatype: SetStocksDto,
          }),
        ).resolves.toBeDefined();

      });
    })
  });
});