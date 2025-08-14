import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminAuthModule } from './admin/admin-auth.module';
import { UserAuthModule } from './user/user-auth.module';
import { JwtStrategy } from './common/strategies/jwt-strategy';
import { JwtRefreshStrategy } from './common/strategies/jwt-refresh-strategy';
import { LocalStrategy } from './common/strategies/local-auth.strategy';
import { GoogleAuthStrategy } from './common/strategies/google-oauth-strategy';
import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AdminAuthModule, UserAuthModule, AdminModule, UserModule],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    AuthService,
    GoogleAuthStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
