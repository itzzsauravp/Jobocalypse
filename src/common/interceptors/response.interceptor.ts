import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map as rxjsMap, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { SENSITIVE_KEYS } from '../constants/sentitive-keys.constants';
import {
  omitKeysFromArray,
  omitKeysFromObject,
} from '../helpers/omitkeys.helper';

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
  ): Observable<GenericResponse<T>> | Observable<any> {
    const response: Response = context.switchToHttp().getResponse();
    const request: Request = context.switchToHttp().getRequest();
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'Request successful';
    response.status(200);
    if (request.url.startsWith('/admin')) {
      return next.handle();
    } else {
      return next.handle().pipe(
        rxjsMap((data) => {
          console.log(data);
          if (Array.isArray(data.data)) {
            data.data = omitKeysFromArray(SENSITIVE_KEYS, data.data);
          } else {
            data.data = omitKeysFromObject(SENSITIVE_KEYS, data.data);
          }
          console.log(data);
          return {
            success: true,
            message,
            payload: data as T,
          };
        }),
      );
    }
  }
}
