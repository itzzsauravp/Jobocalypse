import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { UserAuthController } from './user/user-auth/user-auth.controller';
import { UserAuthController } from './user/user-auth.controller';
import { AdminAuthController } from './admin/admin-auth.controller';
import { FirmAuthController } from './firm/firm-auth.controller';
import { FirmAuthService } from './firm/firm-auth.service';
import { FirmAuthModule } from './firm/firm-auth.module';
import { AdminAuthService } from './admin/admin-auth.service';
import { AdminAuthModule } from './admin/admin-auth.module';
import { UserAuthService } from './user/user-auth.service';
import { UserAuthModule } from './user/user-auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME_MIN')}m`,
        },
      }),
    }),
    FirmAuthModule,
    AdminAuthModule,
    UserAuthModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, FirmAuthService, AdminAuthService, UserAuthService],
  controllers: [AuthController, UserAuthController, AdminAuthController, FirmAuthController],
})
export class AuthModule {}
