import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLocalAuthGuard } from './guards/admin-local-auth.guard';
import type { Request as ExpRequest, Response } from 'express';
import { LoginReturnAdmin } from '../common/auth.inteface';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { JwtRefreshStrategy } from '../common/strategies/jwt-refresh-strategy';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminLocalAuthGuard)
  @Post('login')
  async login(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginReturnAdmin> {
    return await this.adminAuthService.generateToken(request.user, response);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signin')
  async signin(@Body() dto: CreateEntityDTO) {
    return await this.adminAuthService.signup(dto);
  }

  @UseGuards(JwtRefreshStrategy)
  @Post('refresh')
  async refresh(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.adminAuthService.generateToken(request.user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return { admin_auth_status: true };
  }
}
