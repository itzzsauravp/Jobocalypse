import Redis from 'ioredis';
export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT as string),
    });
    return redis;
  },
};
