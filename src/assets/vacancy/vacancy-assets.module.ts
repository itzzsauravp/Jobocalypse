import { Module } from '@nestjs/common';
import { VacancyAssetsService } from './vacancy-assets.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VacancyAssetsService],
  exports: [VacancyAssetsService],
})
export class VacancyAssetsModule {}
