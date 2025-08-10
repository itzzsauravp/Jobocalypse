import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import type { Request as ExpRequest } from 'express';
import { FirmService } from './firm.service';
import { UpdateFirmDTO } from './dtos/update-firm.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('firm')
@Controller('firm')
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Get()
  async getFirmProfile(@Request() request: ExpRequest) {
    return await this.firmService.findFirmByID(request.user.id);
  }

  @Patch('update')
  async updateFirm(
    @Request() request: ExpRequest,
    @Body('data') data: UpdateFirmDTO,
  ) {
    const firm = await this.firmService.findFirmByID(request.user.id);
    const updatedData: UpdateFirmDTO = Object.assign(firm, data);
    return await this.firmService.udpateFirm(request.user.id, updatedData);
  }

  @Delete('delete')
  async softDeleteFirm(@Request() request: ExpRequest) {
    return this.firmService.softDeleteFrim(request.user.id);
  }
}
