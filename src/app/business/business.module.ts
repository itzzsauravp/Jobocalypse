import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, DocumentModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
