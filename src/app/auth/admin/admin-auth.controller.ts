import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, TEST } from 'src/common/constants/throttler-settings';
import { MetadataGuard } from '../common/guards/metadata.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { type Request as ExpRequest, type Response } from 'express';
import { AdminAuthService } from './admin-auth.service';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthEntity } from '../common/decorators/auth-entity.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

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
    return await this.adminAuthService.generateToken(request.entity, response);
  }

  @ResponseMessage('Logout sucessful')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logoutAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.adminAuthService.logout(request.entity.id, response);
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() request: ExpRequest) {
    const { access_token, refresh_token } = request.cookies;
    return this.adminAuthService.me(
      access_token as string,
      refresh_token as string,
    );
  }
}
