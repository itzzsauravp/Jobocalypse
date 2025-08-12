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
import { CreateFirmDTO } from 'src/firm/dtos/create-firm.dto';
import { FirmLocalAuthGuard } from './guards/firm-local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, SIGNUP, TEST } from 'src/common/constants/throttler-settings';

@Controller('auth/firm')
export class FirmAuthController {
  constructor(private readonly firmAuthService: FirmAuthService) {}

  @Throttle(LOGIN)
  @UseGuards(FirmLocalAuthGuard)
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
