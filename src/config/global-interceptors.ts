import { INestApplication } from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

export function configureGlobalInterceptors(app: INestApplication) {
  const responseInterceptor = app.get(ResponseInterceptor);
  app.useGlobalInterceptors(responseInterceptor);
}
