import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'db',
      port: Number(process.env.REDIS_PORT) || 6379,
      db: Number(process.env.REDIS_DB) || 0,
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient() {
    return this.client;
  }
}