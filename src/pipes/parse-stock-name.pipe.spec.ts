import { BadRequestException } from '@nestjs/common';
import { ParseStockNamePipe } from './parse-stock-name.pipe';

describe('ParseStockNamePipe', () => {
  let pipe: ParseStockNamePipe;

  beforeEach(() => {
    pipe = new ParseStockNamePipe();
  });

  // valid cases
  describe('valid inputs', () => {
    const validCases = [
      { input: 'aapl', expected: 'AAPL' },
      { input: 'AAPL', expected: 'AAPL' },
      { input: 'AaPl', expected: 'AAPL' },
      { input: '  aapl  ', expected: 'AAPL' },
    ];

    validCases.forEach(({ input, expected }, index) => {
      it(`should normalize valid input #${index + 1}`, () => {
        expect(pipe.transform(input)).toBe(expected);
      });
    });
  });

  // invalid cases
  describe('invalid inputs', () => {
    const invalidCases = [
      '', // empty
      '   ', // whitespace only
      null, // null
      undefined, // undefined
      'AAPL1', // numbers
      'BTC-USD', // special char
      'AAPL!', // special char
      'AAPL AAPL', // space inside
      {}, // wrong type
      123, // wrong type
    ];

    invalidCases.forEach((input, index) => {
      it(`should throw for invalid input #${index + 1}`, () => {
        expect(() => pipe.transform(input as any)).toThrow(BadRequestException);
      });
    });
  });
});