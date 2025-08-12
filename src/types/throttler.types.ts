import type {
  Resolvable,
  ThrottlerGetTrackerFunction,
  ThrottlerGenerateKeyFunction,
} from '@nestjs/throttler';

export interface ThrottlerMethodOrControllerOptions {
  limit?: Resolvable<number>;
  ttl?: Resolvable<number>;
  blockDuration?: Resolvable<number>;
  getTracker?: ThrottlerGetTrackerFunction;
  generateKey?: ThrottlerGenerateKeyFunction;
}
