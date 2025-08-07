import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('All the modules have been initialized...');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
