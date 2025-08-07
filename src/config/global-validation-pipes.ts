import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureGlobalValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
