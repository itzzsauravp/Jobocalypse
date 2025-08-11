import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { FirmModule } from 'src/firm/firm.module';
import { VacancyModule } from 'src/vacancy/vacancy.module';

@Module({
  imports: [PrismaModule, UserModule, FirmModule, VacancyModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
