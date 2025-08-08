import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { UserModule } from 'src/user/user.module';
import { SharedAuthModule } from '../common/shared-auth.module';
import { UserLocalStrategy } from './strategy/user-local.strategy';

@Module({
  imports: [UserModule, SharedAuthModule],
  controllers: [UserAuthController],
  providers: [UserAuthService, UserLocalStrategy],
  exports: [UserAuthService],
})
export class UserAuthModule {}
