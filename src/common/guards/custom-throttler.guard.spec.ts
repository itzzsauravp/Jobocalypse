import { CustomThrottlerGuard } from './custom-throttler.guard';

describe('CustomThrottlerGuard', () => {
  it('should be defined', () => {
    expect(new CustomThrottlerGuard()).toBeDefined();
  });
});
