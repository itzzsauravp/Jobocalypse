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
import { FirmAuthService } from './firm-auth.service';
import type { Request as ExpRequest, Response } from 'express';
import { CreateFirmDTO } from 'src/app/firm/dtos/create-firm.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, SIGNUP, TEST } from 'src/common/constants/throttler-settings';
import { MetadataGuard } from '../common/guards/metadata.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthEntity } from '../common/guards/auth-entity.guard';

@Controller('auth/firm')
export class FirmAuthController {
  constructor(private readonly firmAuthService: FirmAuthService) {}

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('firm')
  @Post('login')
  async login(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.firmAuthService.generateToken> {
    return await this.firmAuthService.generateToken(request.user, response);
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() dto: CreateFirmDTO,
  ): ReturnType<typeof this.firmAuthService.signup> {
    return await this.firmAuthService.signup(dto);
  }

  @Throttle(LOGIN)
  @UseGuards(JwtAuthRefreshGuard)
  @Post('refresh')
  async refresh(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.firmAuthService.generateToken> {
    return await this.firmAuthService.generateToken(request.user, response);
  }

  @Throttle(TEST)
  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return { firm_auth_status: true };
  }
}
