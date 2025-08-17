import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';
import { type Request as ExpRequest } from 'express';
import { CreateBusinessAccDTO } from './dtos/create-business-acc.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateBusinessAccDTO } from './dtos/update-business-acc.dto';
import { BusinessOwnerGuard } from './guards/business-owner.guard';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async getBusinessInfo(@Request() request: ExpRequest) {
    return this.businessService.findByID(request.businessID);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 5))
  async requestForBusinessAcount(
    @Request() request: ExpRequest,
    @Body() dto: CreateBusinessAccDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.businessService.create(request.entity.id, dto, files);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateBusiness(
    @Request() request: ExpRequest,
    @Body() dto: UpdateBusinessAccDTO,
  ) {
    return this.businessService.update(request.entity.id, dto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteBusiness(@Request() request: ExpRequest) {
    return this.businessService.delete(request.entity.id);
  }
}
