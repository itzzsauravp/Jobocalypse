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
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import type { Request as ExpRequest } from 'express';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('firm')
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Get('/list')
  async listFirmsVacancies(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.listFirmsVacancies> {
    return await this.vacancyService.listFirmsVacancies(request.user.id);
  }

  @Post()
  async createVacancy(
    @Body() dto: CreateVacancyDTO,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.createVacancy> {
    return this.vacancyService.createVacancy(request.user.id, dto);
  }

  @ResponseMessage('vacancy updated successfully')
  @Patch(':id')
  async updateVacancy(
    @Body() dto: UpdateVacancyDTO,
    @Request() request: ExpRequest,
    @Param('id') id: string,
  ): ReturnType<typeof this.vacancyService.updateVacancy> {
    return this.vacancyService.updateVacancy(request.user.id, id, dto);
  }

  @ResponseMessage('vacancy delete successfully')
  @Delete(':id')
  async getVacancyByID(
    @Param('id') id: string,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.findVacancyByID> {
    return await this.vacancyService.deleteVacancy(id, request.user.id);
  }
}
