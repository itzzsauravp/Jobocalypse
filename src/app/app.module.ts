import { ExecutionContext, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { AdminModule } from './admin/admin.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from '../common/guards/custom-throttler.guard';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Request } from 'express';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AdminModule,
    VacancyModule,
    CloudinaryModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.getOrThrow<number>('THROTTLE_TTL_IN_SEC') * 1000,
            limit: configService.getOrThrow<number>('THROTTLE_LIMIT'),
          },
        ],
        storage: new ThrottlerStorageRedisService({
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: +configService.getOrThrow<number>('REDIS_PORT'),
        }),
        generateKey: (context: ExecutionContext) => {
          const request: Request = context.switchToHttp().getRequest();
          console.log(request.ip);
          return `throttler-ip-(${request.ip})`;
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ResponseInterceptor,
    AllExceptionsFilter,
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
  ],
})
export class AppModule {}
