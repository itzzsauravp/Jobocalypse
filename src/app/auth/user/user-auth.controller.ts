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
import { Throttle } from '@nestjs/throttler';
import { LOGIN, SIGNUP, TEST } from 'src/common/constants/throttler-settings';
import { MetadataGuard } from '../common/guards/metadata.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import type { Request as ExpRequest, Response } from 'express';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserAuthService } from './user-auth.service';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { AuthEntity } from '../common/decorators/auth-entity.decorator';
import { GoogleAuthGuard } from '../common/guards/google-oauth.guard';

@Controller('auth/user')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('user')
  @Post('login')
  async loginAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.userAuthService.generateToken> {
    return await this.userAuthService.generateToken(request.entity, response);
  }

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, JwtAuthRefreshGuard)
  @AuthEntity('user')
  @Post('refresh')
  async refreshAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.userAuthService.generateToken> {
    return await this.userAuthService.generateToken(request.entity, response);
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signupUser(
    @Body() dto: CreateEntityDTO,
  ): ReturnType<typeof this.userAuthService.signup> {
    return await this.userAuthService.signup(dto);
  }

  @Throttle(TEST)
  @UseGuards(JwtAuthGuard)
  @Get('test')
  testAdmin(@Request() request: ExpRequest) {
    return { admin_auth_status: true, type: request.entity.type };
  }

  @Throttle(SIGNUP)
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async auth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleAuthCallback(@Request() request: ExpRequest) {
    return { user: request.user };
  }
}
