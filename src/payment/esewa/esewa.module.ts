import { Module } from '@nestjs/common';
import { EsewaService } from './esewa.service';
import { EsewaController } from './esewa.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: EsewaService,
      inject: [HttpService],
      useFactory: (httpService: HttpService) =>
        new EsewaService(
          {
            environment: 'dev',
            success_url: 'https://developer.esewa.com.np/success',
            failure_url: 'https://developer.esewa.com.np/success',
          },
          httpService,
        ),
    },
  ],
  exports: [EsewaService],
  controllers: [EsewaController],
})
export class EsewaModule {}
