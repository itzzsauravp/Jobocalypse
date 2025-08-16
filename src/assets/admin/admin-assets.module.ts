import { Module } from '@nestjs/common';
import { AdminAssetsService } from './admin-assets.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AdminAssetsService],
  exports: [AdminAssetsService],
})
export class AdminAssetsModule {}
