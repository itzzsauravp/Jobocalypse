import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminModule } from 'src/app/admin/admin.module';
import { SharedAuthModule } from '../common/shared-auth.module';

@Module({
  imports: [AdminModule, SharedAuthModule],
  providers: [AdminAuthService],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
