import {
  Body,
  Controller,
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

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

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
}
