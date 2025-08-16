import { Module } from '@nestjs/common';
import { BusinessAssetsService } from './business-assets.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BusinessAssetsService],
  exports: [BusinessAssetsService],
})
export class BusinessAssetsModule {}
