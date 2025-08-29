import { Module } from '@nestjs/common';
import { BusinessAssetsService } from './business-assets.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [BusinessAssetsService],
  exports: [BusinessAssetsService],
})
export class BusinessAssetsModule {}
