import { TooManyRequestsExceptionFilter } from './too-many-requests-exception.filter';

describe('TooManyRequestsExceptionFilter', () => {
  it('should be defined', () => {
    expect(new TooManyRequestsExceptionFilter()).toBeDefined();
  });
});
