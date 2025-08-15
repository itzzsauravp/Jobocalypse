import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';

interface GenericResponse<T> {
  success: boolean;
  message: string;
  payload: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, GenericResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponse<T>> {
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'Request successful';
    const response: Response = context.switchToHttp().getResponse();
    response.status(200);
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message,
        payload: data as T,
      })),
    );
  }
}
