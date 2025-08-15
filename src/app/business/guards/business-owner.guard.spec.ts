import { BusinessOwnerGuard } from './business-owner.guard';

describe('BusinessOwnerGuard', () => {
  it('should be defined', () => {
    expect(new BusinessOwnerGuard()).toBeDefined();
  });
});
