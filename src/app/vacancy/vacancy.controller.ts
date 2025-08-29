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
import { VacancyAssetsService } from 'src/assets/vacancy/vacancy-assets.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('vacancy')
export class VacancyController {
  constructor(
    private readonly vacancyService: VacancyService,
    private readonly vacanyAssetsService: VacancyAssetsService,
  ) {}

  @Get('/all')
  async findAllVacancy(
    @Query() dto: QueryFitlers,
  ): ReturnType<typeof this.vacancyService.findAll> {
    return await this.vacancyService.findAllGeneric(dto);
  }

  @Get('/list')
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

  @Get('/list/:id')
  async listVacanciesForBusinessByID(
    @Param('id') id: string,
    @Query() dto: QueryFitlers,
  ): ReturnType<typeof this.vacancyService.listBusinessVacancies> {
    return await this.vacancyService.listBusinessVacancies(id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getVacancy(@Param('id') id: string) {
    return await this.vacancyService.findByID(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  async createVacancy(
    @Body() dto: CreateVacancyDTO,
    @Request() request: ExpRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): ReturnType<typeof this.vacancyService.createVacancy> {
    return this.vacancyService.createVacancy(
      request.entity.id,
      request.businessID,
      dto,
      files,
    );
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  async applyForVacancy(
    @Request() request: ExpRequest,
    @Param('id') id: string,
  ): ReturnType<typeof this.vacancyService.applyForVacancy> {
    return await this.vacancyService.applyForVacancy(id, request.entity.id);
  }

  @Get(':id/applicants')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async getApplicants(
    @Request() request: ExpRequest,
    @Param('id') id: string,
    @Query() query: QueryFitlers,
  ): ReturnType<typeof this.vacancyService.getVacancyApplicants> {
    return await this.vacancyService.getVacancyApplicants(
      id,
      request.businessID,
      query,
    );
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
  async deleteVacancy(
    @Param('id') vacancyID: string,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.findByID> {
    return await this.vacancyService.deleteVacancy(
      request.businessID,
      vacancyID,
    );
  }

  @Delete('asset/:id')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async deleteVacancyAsset(@Param('id') assetID: string) {
    await this.vacanyAssetsService.deleteVacancyAsset(assetID);
  }
}
