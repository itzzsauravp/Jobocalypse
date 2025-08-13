import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { UserModule } from 'src/app/user/user.module';
import { SharedAuthModule } from '../common/shared-auth.module';

@Module({
  imports: [UserModule, SharedAuthModule],
  controllers: [UserAuthController],
  providers: [UserAuthService],
  exports: [UserAuthService],
})
export class UserAuthModule {}
