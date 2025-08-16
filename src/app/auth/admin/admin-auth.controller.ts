import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, TEST } from 'src/common/constants/throttler-settings';
import { MetadataGuard } from '../common/guards/metadata.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import type { Request as ExpRequest, Response } from 'express';
import { AdminAuthService } from './admin-auth.service';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthEntity } from '../common/decorators/auth-entity.decorator';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('admin')
  @Post('login')
  async loginAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.adminAuthService.generateToken> {
    console.log(request.entity);
    return await this.adminAuthService.generateToken(request.entity, response);
  }

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, JwtAuthRefreshGuard)
  @AuthEntity('admin')
  @Post('refresh')
  async refreshAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.adminAuthService.generateToken> {
    return await this.adminAuthService.generateToken(request.entity, response);
  }

  @Throttle(TEST)
  @UseGuards(JwtAuthGuard)
  @Get('test')
  testAdmin(@Request() request: ExpRequest) {
    return { admin_auth_status: true, type: request.entity.type };
  }
}
