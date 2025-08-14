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
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, SIGNUP, TEST } from 'src/common/constants/throttler-settings';
import { MetadataGuard } from './guards/metadata.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthEntity } from './decorators/auth-entity.decorator';
import { type Request as ExpRequest, type Response } from 'express';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { JwtAuthRefreshGuard } from './guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-oauth.guard';
import { GenericOAuthEntity } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ADMIN AUTH ROUTES
  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('admin')
  @Post('admin/login')
  async loginAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.authService.generateToken> {
    return await this.authService.generateToken(
      request.authEntity,
      request.user,
      response,
    );
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(MetadataGuard)
  @AuthEntity('admin')
  @Post('admin/signup')
  async signupAdmin(
    @Request() request: ExpRequest,
    @Body() dto: CreateEntityDTO,
  ): ReturnType<typeof this.authService.signup> {
    return await this.authService.signup(request.authEntity, dto);
  }

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, JwtAuthRefreshGuard)
  @AuthEntity('admin')
  @Post('admin/refresh')
  async refreshAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.authService.generateToken> {
    return await this.authService.generateToken(
      request.authEntity,
      request.user,
      response,
    );
  }

  @Throttle(TEST)
  @UseGuards(MetadataGuard, JwtAuthGuard)
  @AuthEntity('admin')
  @Get('admin/test')
  testAdmin(@Request() request: ExpRequest) {
    return { admin_auth_status: true, type: request.user };
  }

  // USER AUTH ROUTES
  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('user')
  @Post('user/login')
  async loginUser(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.authService.generateToken> {
    return await this.authService.generateToken(
      request.authEntity,
      request.user,
      response,
    );
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(MetadataGuard)
  @AuthEntity('user')
  @Post('user/signup')
  async signupUser(
    @Request() request: ExpRequest,
    @Body() dto: CreateEntityDTO,
  ): ReturnType<typeof this.authService.signup> {
    return await this.authService.signup(request.authEntity, dto);
  }

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, JwtAuthRefreshGuard)
  @AuthEntity('user')
  @Post('user/refresh')
  async refreshUser(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.authService.generateToken> {
    return await this.authService.generateToken(
      request.authEntity,
      request.user,
      response,
    );
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async auth() {}

  @UseGuards(GoogleAuthGuard, MetadataGuard)
  @Get('google/callback')
  async googleAuthCallback(
    @Request() request: ExpRequest,
    @Res() response: Response,
  ) {
    await this.authService.handleOpenAuthentication(
      request.user as GenericOAuthEntity,
      response,
    );
    response.redirect('/');
  }

  @Throttle(TEST)
  @UseGuards(MetadataGuard, JwtAuthGuard)
  @AuthEntity('user')
  @Get('user/test')
  testUser(@Request() request: ExpRequest) {
    return { admin_auth_status: true, type: request.user };
  }

  // FIRM AUTH ROUTES
  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('firm')
  @Post('firm/login')
  async loginFirm(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.authService.generateToken> {
    return await this.authService.generateToken(
      request.authEntity,
      request.user,
      response,
    );
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(MetadataGuard)
  @AuthEntity('firm')
  @Post('firm/signup')
  async signupFrim(
    @Request() request: ExpRequest,
    @Body() dto: CreateEntityDTO,
  ): ReturnType<typeof this.authService.signup> {
    return await this.authService.signup(request.authEntity, dto);
  }

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, JwtAuthRefreshGuard)
  @AuthEntity('firm')
  @Post('firm/refresh')
  async refreshFrim(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.authService.generateToken> {
    return await this.authService.generateToken(
      request.authEntity,
      request.user,
      response,
    );
  }

  @Throttle(TEST)
  @UseGuards(MetadataGuard, JwtAuthGuard)
  @AuthEntity('firm')
  @Get('firm/test')
  testFrim(@Request() request: ExpRequest) {
    return { admin_auth_status: true, type: request.user };
  }
}
