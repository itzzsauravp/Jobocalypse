import { Module } from '@nestjs/common';
import { FirmController } from './firm.controller';
import { FirmService } from './firm.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FirmController],
  providers: [FirmService],
  exports: [FirmService],
})
export class FirmModule {}
