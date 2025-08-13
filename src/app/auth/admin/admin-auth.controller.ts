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
import type { Request as ExpRequest, Response } from 'express';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, SIGNUP, TEST } from 'src/common/constants/throttler-settings';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { MetadataGuard } from '../common/guards/metadata.guard';
import { AuthEntity } from '../common/guards/auth-entity.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('admin')
  @Post('login')
  async login(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.adminAuthService.generateToken> {
    return await this.adminAuthService.generateToken(request.user, response);
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() dto: CreateEntityDTO,
  ): ReturnType<typeof this.adminAuthService.signup> {
    return await this.adminAuthService.signup(dto);
  }

  @Throttle(LOGIN)
  @UseGuards(JwtAuthRefreshGuard)
  @Post('refresh')
  async refresh(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.adminAuthService.generateToken> {
    return await this.adminAuthService.generateToken(request.user, response);
  }

  @Throttle(TEST)
  @UseGuards(JwtAuthGuard)
  @Get('test')
  test(@Request() request: ExpRequest) {
    return { admin_auth_status: true, type: request.user.type };
  }
}
