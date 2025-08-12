import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsExceptionFilter extends HttpException {
  constructor(message?: string) {
    super(message || 'Too many request', HttpStatus.TOO_MANY_REQUESTS);
  }
}
