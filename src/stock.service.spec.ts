import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StockService } from './stock.service';

describe('StockService.buySell', () => {
  let service: StockService;
  let repo: any;

  beforeEach(() => {
    repo = {
      getBankStock: jest.fn(),
      getWalletStock: jest.fn(),
      incrementBankStock: jest.fn(),
      incrementWalletStock: jest.fn(),
      pushLog: jest.fn(),
    };

    service = new StockService(repo);
  });

  //* FAILURES

  // stock does not exist
  it('should throw NotFoundException when stock does not exist', async () => {
    repo.getBankStock.mockResolvedValue(null);

    await expect(
      service.buySell('w1', 'AAPL', 'buy'),
    ).rejects.toThrow(NotFoundException);
  });

  // buy when no stock in bank
  it('should throw BadRequestException when buying with empty bank', async () => {
    repo.getBankStock.mockResolvedValue(0);

    await expect(
      service.buySell('w1', 'AAPL', 'buy'),
    ).rejects.toThrow(BadRequestException);
  });

  // sell when wallet empty
  it('should throw BadRequestException when selling without stock in wallet', async () => {
    repo.getBankStock.mockResolvedValue(10);
    repo.getWalletStock.mockResolvedValue(0);

    await expect(
      service.buySell('w1', 'AAPL', 'sell'),
    ).rejects.toThrow(BadRequestException);
  });

  //* SUCCESSES

  // BUY success
  it('should buy stock successfully', async () => {
    repo.getBankStock.mockResolvedValue(10);
    repo.getWalletStock.mockResolvedValue(0);

    await service.buySell('w1', 'AAPL', 'buy');

    expect(repo.incrementBankStock).toHaveBeenCalledWith('AAPL', -1);
    expect(repo.incrementWalletStock).toHaveBeenCalledWith('w1', 'AAPL', 1);
    expect(repo.pushLog).toHaveBeenCalled();
  });

  // SELL success
  it('should sell stock successfully', async () => {
    repo.getBankStock.mockResolvedValue(10);
    repo.getWalletStock.mockResolvedValue(5);

    await service.buySell('w1', 'AAPL', 'sell');

    expect(repo.incrementBankStock).toHaveBeenCalledWith('AAPL', 1);
    expect(repo.incrementWalletStock).toHaveBeenCalledWith('w1', 'AAPL', -1);
    expect(repo.pushLog).toHaveBeenCalled();
  });

  // log only on success
  it('should not log when operation fails', async () => {
    repo.getBankStock.mockResolvedValue(0);

    await expect(
      service.buySell('w1', 'AAPL', 'buy'),
    ).rejects.toThrow();

    expect(repo.pushLog).not.toHaveBeenCalled();
  });
});