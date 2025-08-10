import { INestApplication } from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';

export function configureGlobalInterceptors(app: INestApplication) {
  const reflectorObj = app.get(Reflector);
  const responseInterceptor = new ResponseInterceptor(reflectorObj);
  app.useGlobalInterceptors(responseInterceptor);
}
