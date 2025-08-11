import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { JwtAuthGuard } from 'src/auth/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import type { Request as ExpRequest } from 'express';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';

@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Get('all')
  async getAllVacancy(): ReturnType<typeof this.vacancyService.findAllVacancy> {
    return await this.vacancyService.findAllVacancy();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('firm')
  @Post()
  async createVacancy(
    @Body() dto: CreateVacancyDTO,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.createVacancy> {
    return this.vacancyService.createVacancy(request.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('firm')
  @Patch()
  async updateVacancy(
    @Body() dto: UpdateVacancyDTO,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.vacancyService.updateVacancy> {
    return this.vacancyService.updateVacancy(request.user.id, dto);
  }

  @Delete('vacancy/:id')
  @Get(':id')
  async getVacancyByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.vacancyService.findVacancyByID> {
    return await this.vacancyService.findVacancyByID(id);
  }
}
