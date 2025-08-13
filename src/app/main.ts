import { bootstrap } from './bootstrap';

bootstrap()
  .then(() => console.log('Nestjs bootstrap running...'))
  .catch(() => console.log('Nestjs bootstrap error'));
