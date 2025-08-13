import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../common/shared-auth.module';
import { AdminModule } from 'src/app/admin/admin.module';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

@Module({
  imports: [AdminModule, SharedAuthModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
