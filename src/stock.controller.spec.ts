import { Test, TestingModule } from '@nestjs/testing';
import { StockController as StockController } from './stock.controller';
import { StockService } from './stock.service';

describe('AppController', () => {
  let appController: StockController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [StockService],
    }).compile();

    appController = app.get<StockController>(StockController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
