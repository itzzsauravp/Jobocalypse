import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { UserModule } from 'src/app/user/user.module';
import { SharedAuthModule } from '../common/shared-auth.module';
import { UserAssetsModule } from 'src/assets/user/user-assets.module';

@Module({
  imports: [UserModule, SharedAuthModule, UserAssetsModule],
  providers: [UserAuthService],
  controllers: [UserAuthController],
})
export class UserAuthModule {}
