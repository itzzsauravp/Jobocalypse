import { Module } from '@nestjs/common';
import { FirmModule } from 'src/app/firm/firm.module';
import { SharedAuthModule } from '../common/shared-auth.module';
import { FirmAuthService } from './firm-auth.service';
import { FirmLocalStrategy } from './strategy/firm-local.strategy';
import { FirmAuthController } from './firm-auth.controller';

@Module({
  imports: [FirmModule, SharedAuthModule],
  controllers: [FirmAuthController],
  providers: [FirmAuthService, FirmLocalStrategy],
  exports: [FirmAuthService],
})
export class FirmAuthModule {}
