import { Module } from '@nestjs/common';
import { VacancyAssetsService } from './vacancy-assets.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [VacancyAssetsService],
  exports: [VacancyAssetsService],
})
export class VacancyAssetsModule {}
