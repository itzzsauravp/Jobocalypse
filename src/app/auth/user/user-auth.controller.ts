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
import { type Request as ExpRequest, type Response } from 'express';
import { UserAuthService } from './user-auth.service';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, SIGNUP, TEST } from 'src/common/constants/throttler-settings';
import { MetadataGuard } from '../common/guards/metadata.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthEntity } from '../common/guards/auth-entity.guard';

@Controller('auth/user')
export class UserAuthController {
  // constructor(private readonly userAuthService: UserAuthService) {}
  private readonly userAuthService: UserAuthService;

  constructor(userAuthService: UserAuthService) {
    this.userAuthService = userAuthService;
  }

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('user')
  @Post('login')
  async login(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.userAuthService.generateToken> {
    return await this.userAuthService.generateToken(request.user, response);
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() dto: CreateEntityDTO,
  ): ReturnType<typeof this.userAuthService.signup> {
    return await this.userAuthService.signup(dto);
  }

  @Throttle(LOGIN)
  @UseGuards(JwtAuthRefreshGuard)
  @Post('refresh')
  async refresh(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.userAuthService.generateToken> {
    return await this.userAuthService.generateToken(request.user, response);
  }

  @Throttle(TEST)
  @UseGuards(JwtAuthGuard)
  @Get('test')
  test(@Request() request: ExpRequest) {
    return { user_auth_status: true, request: request.user };
  }
}
