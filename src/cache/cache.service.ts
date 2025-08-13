import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.provider';

function serialize(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    return JSON.stringify(value);
  }
  throw new Error(`Unsupported type for Redis: ${typeof value}`);
}

function deserialize<T>(value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
}

@Injectable()
export class CacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async set(key: string, value: unknown, ttlSeconds: number = 1_08_000) {
    await this.redisClient.set(key, serialize(value), 'EX', ttlSeconds);
  }

  async get<T>(key: string) {
    const data = await this.redisClient.get(key);
    if (data === null) return null;
    return deserialize<T>(data);
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }
}
