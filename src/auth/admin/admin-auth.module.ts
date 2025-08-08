import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../common/shared-auth.module';
import { AdminModule } from 'src/admin/admin.module';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminLocalStrategy } from './strategy/admin-local.strategy';

@Module({
  imports: [AdminModule, SharedAuthModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminLocalStrategy],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
