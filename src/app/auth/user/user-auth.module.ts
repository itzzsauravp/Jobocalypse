import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { UserModule } from 'src/app/user/user.module';
import { SharedAuthModule } from '../common/shared-auth.module';

@Module({
  imports: [UserModule, SharedAuthModule],
  providers: [UserAuthService],
  controllers: [UserAuthController],
})
export class UserAuthModule {}
