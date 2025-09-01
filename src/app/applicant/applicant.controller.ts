import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';
import { APPLICATION_STATUS } from 'generated/prisma';
import { BusinessOwnerGuard } from '../business/guards/business-owner.guard';
import type { Request as ExpRequest } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('applicant')
export class ApplicantController {
  constructor(private readonly applicantService: ApplicantService) {}

  @Patch(':id')
  async updateApplicantStatus(
    @Body('status') status: APPLICATION_STATUS,
    @Param('id') id: string,
  ): ReturnType<typeof this.applicantService.updateApplicantStatus> {
    return await this.applicantService.updateApplicantStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @Delete(':id')
  async deleteApplication(
    @Param('id') id: string,
    @Request() request: ExpRequest,
    @Body('vacancyID') vacancyID: string,
  ) {
    return await this.applicantService.deleteApplication(
      id,
      vacancyID,
      request.businessID,
    );
  }
}
