import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('All modules initialized (OnApplicationBootstrap)');
  }
}
