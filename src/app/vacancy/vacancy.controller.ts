import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Body,
  Get,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import type { Request as ExpRequest } from 'express';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BusinessOwnerGuard } from '../business/guards/business-owner.guard';
import { QueryFitlers } from 'src/common/dtos/pagination.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async listVacanciesForBusiness(
    @Request() request: ExpRequest,
    @Query() dto: QueryFitlers,
  ): ReturnType<typeof this.vacancyService.listBusinessVacancies> {
    return await this.vacancyService.listBusinessVacancies(
      request.businessID,
      dto,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  async createVacancy(
    @Body() dto: CreateVacancyDTO,
    @Request() request: ExpRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): ReturnType<typeof this.vacancyService.createVacancy> {
    return this.vacancyService.createVacancy(request.businessID, dto, files);
  }

  @Patch(':id')
  @ResponseMessage('vacancy updated successfully')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async updateVacancy(
    @Body() dto: UpdateVacancyDTO,
    @Request() request: ExpRequest,
    @Param('id') vacancyID: string,
  ): ReturnType<typeof this.vacancyService.updateVacancy> {
    return this.vacancyService.updateVacancy(
      request.businessID,
      vacancyID,
      dto,
    );
  }

  @Delete(':id')
  @ResponseMessage('vacancy deleted successfully')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async getVacancyByID(
    @Param('id') vacancyID: string,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.findByID> {
    return await this.vacancyService.deleteVacancy(
      request.businessID,
      vacancyID,
    );
  }
}
