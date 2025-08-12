import { INestApplication } from '@nestjs/common';

export function configureGlobalGuards(app: INestApplication) {
  app.useGlobalGuards();
}
