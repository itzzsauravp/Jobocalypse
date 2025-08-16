import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserAssetsService } from './user-assets.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [UserAssetsService],
  exports: [UserAssetsService],
})
export class UserAssetsModule {}
