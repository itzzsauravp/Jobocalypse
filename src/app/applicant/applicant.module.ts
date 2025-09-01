import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { ApplicantController } from './applicant.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [PrismaModule, BusinessModule],
  providers: [ApplicantService],
  controllers: [ApplicantController],
})
export class ApplicantModule {}
