import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LOGIN, SIGNUP, TEST } from 'src/common/constants/throttler-settings';
import { MetadataGuard } from '../common/guards/metadata.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import type { Request as ExpRequest, Response } from 'express';
import { JwtAuthRefreshGuard } from '../common/guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserAuthService } from './user-auth.service';
import { AuthEntity } from '../common/decorators/auth-entity.decorator';
import { GithubAuthGuard } from '../common/guards/github-oauth.guard';
import { GoogleAuthGuard } from '../common/guards/google-oauth.guard';
import { GITHUB, GOOGLE } from '../common/constants';
import { CreateUserDTO } from 'src/app/user/dtos/create-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth/user')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Throttle(LOGIN)
  @UseGuards(MetadataGuard, LocalAuthGuard)
  @AuthEntity('user')
  @Post('login')
  async loginUser(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.userAuthService.generateToken> {
    console.log('loggin in..');
    return await this.userAuthService.generateToken(request.entity, response);
  }

  @UseGuards(MetadataGuard, JwtAuthRefreshGuard)
  @AuthEntity('user')
  @Post('refresh')
  async refreshUser(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): ReturnType<typeof this.userAuthService.generateToken> {
    return await this.userAuthService.generateToken(request.entity, response);
  }

  @Throttle(SIGNUP)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @Post('signup')
  async signupUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateUserDTO,
  ): ReturnType<typeof this.userAuthService.signup> {
    return await this.userAuthService.signup(dto, file);
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
  async authGoogle() {}

  @ResponseMessage('Logout sucessful')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logoutAdmin(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.userAuthService.logout(request.entity.id, response);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(
    @Request() request: ExpRequest,
    @Res() response: Response,
  ) {
    await this.userAuthService.handleOpenAuthentication(
      GOOGLE,
      request.user,
      response,
    );
    return response.redirect('http://localhost:8000/');
  }

  @Throttle(SIGNUP)
  @UseGuards(GithubAuthGuard)
  @Get('github')
  async authGithub() {}

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubAuthCallback(
    @Request() request: ExpRequest,
    @Res() response: Response,
  ) {
    await this.userAuthService.handleOpenAuthentication(
      GITHUB,
      request.user,
      response,
    );
    return response.redirect('http://localhost:8000/');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() request: ExpRequest) {
    const { access_token, refresh_token } = request.cookies;
    return await this.userAuthService.me(
      access_token as string,
      refresh_token as string,
    );
  }
}
