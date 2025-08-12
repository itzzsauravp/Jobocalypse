import { Injectable } from '@nestjs/common';

import { ThrottlerGuard } from '@nestjs/throttler';
import { TooManyRequestsExceptionFilter } from '../exceptions/too-many-requests-exception.filter';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    throw new TooManyRequestsExceptionFilter(
      "Slow down!! You've exceded the request limit",
    );
  }
}
