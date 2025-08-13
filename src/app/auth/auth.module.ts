import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FirmAuthModule } from './firm/firm-auth.module';
import { AdminAuthModule } from './admin/admin-auth.module';
import { UserAuthModule } from './user/user-auth.module';
import { JwtStrategy } from './common/strategies/jwt-strategy';
import { JwtRefreshStrategy } from './common/strategies/jwt-refresh-strategy';
import { SharedAuthModule } from './common/shared-auth.module';
import { LocalStrategy } from './common/strategies/local-auth.strategy';
import { AuthServiceRegistry } from './registry/auth-service.registry';

@Module({
  imports: [FirmAuthModule, AdminAuthModule, UserAuthModule, SharedAuthModule],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    AuthServiceRegistry,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
