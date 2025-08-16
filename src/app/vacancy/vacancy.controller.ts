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
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import type { Request as ExpRequest } from 'express';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Get('/list')
  async listFirmsVacancies(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.listBusinessVacancies> {
    return await this.vacancyService.listBusinessVacancies(request.entity.id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 3))
  async createVacancy(
    @Body() dto: CreateVacancyDTO,
    @Request() request: ExpRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): ReturnType<typeof this.vacancyService.createVacancy> {
    return this.vacancyService.createVacancy(request.entity.id, dto, files);
  }

  @ResponseMessage('vacancy updated successfully')
  @Patch(':id')
  async updateVacancy(
    @Body() dto: UpdateVacancyDTO,
    @Request() request: ExpRequest,
    @Param('id') id: string,
  ): ReturnType<typeof this.vacancyService.updateVacancy> {
    return this.vacancyService.updateVacancy(request.entity.id, id, dto);
  }

  @ResponseMessage('vacancy delete successfully')
  @Delete(':id')
  async getVacancyByID(
    @Param('id') id: string,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.findByID> {
    return await this.vacancyService.deleteVacancy(id, request.entity.id);
  }
}
