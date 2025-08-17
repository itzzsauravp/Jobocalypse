import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { BusinessAssetsModule } from 'src/assets/business/business-assets.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, BusinessAssetsModule, CacheModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
