import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export function configureGlobalMiddlware(app: INestApplication) {
  app.use(cookieParser());
}
