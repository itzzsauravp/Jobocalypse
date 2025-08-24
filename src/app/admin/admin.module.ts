import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/app/user/user.module';
import { VacancyModule } from 'src/app/vacancy/vacancy.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { BusinessModule } from '../business/business.module';
import { AdminAssetsModule } from 'src/assets/admin/admin-assets.module';
import { UserAssetsModule } from 'src/assets/user/user-assets.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    UserAssetsModule,
    VacancyModule,
    BusinessModule,
    CloudinaryModule,
    AdminAssetsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
