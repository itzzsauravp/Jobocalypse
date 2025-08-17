import { Module } from '@nestjs/common';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { VacancyAssetsModule } from 'src/assets/vacancy/vacancy-assets.module';
import { BusinessModule } from '../business/business.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    VacancyAssetsModule,
    BusinessModule,
    CacheModule,
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
  exports: [VacancyService],
})
export class VacancyModule {}
