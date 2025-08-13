import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureGlobalInterceptors } from '../config/global-interceptors';
import { configureGlobalExceptionFilters } from '../config/global-exception-filters';
import { configureGlobalValidationPipe } from '../config/global-validation-pipes';
import { configureGlobalMiddlware } from '../config/global-middleware';
import { configureSwagger } from '../config/swagger';
import { configureGlobalGuards } from '../config/global-guards';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureSwagger(app);
  configureGlobalMiddlware(app);
  configureGlobalValidationPipe(app);
  configureGlobalInterceptors(app);
  configureGlobalExceptionFilters(app);
  configureGlobalGuards(app);

  await app.listen(process.env.PORT ?? 3000);
}
