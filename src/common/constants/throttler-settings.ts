import { Request } from 'express';
import { ThrottlerMethodOrControllerOptions } from 'src/types/throttler.types';

export const DEFAULT: Record<string, ThrottlerMethodOrControllerOptions> = {
  default: {
    limit: 100,
    ttl: 60_000,
  },
};

export const SIGNUP: Record<string, ThrottlerMethodOrControllerOptions> = {
  default: {
    limit: 5,
    ttl: 3_600_000,
    blockDuration: 86_400_000,
  },
};

export const LOGIN: Record<string, ThrottlerMethodOrControllerOptions> = {
  default: {
    limit: 5,
    ttl: 900_000,
    blockDuration: 3_600_000,
  },
};

export const TEST: Record<string, ThrottlerMethodOrControllerOptions> = {
  default: {
    limit: 5,
    ttl: 5_000,
    blockDuration: 10_000,
  },
};
