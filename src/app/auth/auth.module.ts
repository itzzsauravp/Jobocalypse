import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { LocalStrategy } from './strategies/local-auth.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AdminModule } from '../admin/admin.module';
import { FirmModule } from '../firm/firm.module';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthStrategy } from './strategies/google-oauth-strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
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
    UserModule,
    AdminModule,
    FirmModule,
    PrismaModule,
  ],
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
