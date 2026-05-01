import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { StockModule } from '../src/stock.module';
import Redis from 'ioredis';

describe('Stock API (e2e)', () => {
  let app: INestApplication;

  let redis: Redis;

  beforeAll(async () => {
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_DB = '1';

    redis = new Redis({
      host: 'localhost',
      port: 6379,
      db: 1,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StockModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await redis.flushdb();
  });

  afterAll(async () => {
    await app.close();
    await redis.quit();
  });

  // setup bank
  it('should set stocks', async () => {
    await request(app.getHttpServer())
      .post('/stocks')
      .send({
        stocks: [{ name: 'AAPL', quantity: 10 }],
      })
      .expect(201);
  });

  // full flow: buy
  it('should buy stock and update wallet', async () => {
    const server = app.getHttpServer();

    // set bank
    await request(server).post('/stocks').send({
      stocks: [{ name: 'AAPL', quantity: 10 }],
    });

    // buy
    await request(server)
      .post('/wallets/w1/stocks/AAPL')
      .send({ type: 'buy' })
      .expect(201);

    // check wallet
    const wallet = await request(server)
      .get('/wallets/w1')
      .expect(200);

    expect(wallet.body.stocks).toEqual([
      { name: 'AAPL', quantity: 1 },
    ]);
  });

  // log test
  it('should log successful operation', async () => {
    const server = app.getHttpServer();

    await request(server).post('/stocks').send({
      stocks: [{ name: 'AAPL', quantity: 10 }],
    });

    await request(server)
      .post('/wallets/w1/stocks/AAPL')
      .send({ type: 'buy' });

    const log = await request(server)
      .get('/log')
      .expect(200);

    expect(log.body.log.length).toBe(1);
  });

  // error: stock not found
  it('should return 404 for non-existing stock', async () => {
    await request(app.getHttpServer())
      .post('/wallets/w1/stocks/XYZ')
      .send({ type: 'buy' })
      .expect(404);
  });

  //  error: no stock in bank
  it('should return 400 when bank is empty', async () => {
    await request(app.getHttpServer())
      .post('/stocks')
      .send({ stocks: [{ name: 'AAPL', quantity: 0 }] });

    await request(app.getHttpServer())
      .post('/wallets/w1/stocks/AAPL')
      .send({ type: 'buy' })
      .expect(400);
  });
});