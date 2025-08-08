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
import { UserLocalAuthGuard } from './guards/user-local-auth.guard';
import { LoginReturnUser } from '../common/auth.inteface';

@Controller('auth/user')
export class UserAuthController {
  constructor(private readonly authService: UserAuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserLocalAuthGuard)
  @Post('login')
  async login(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginReturnUser> {
    return await this.authService.generateToken(request.user, response);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signin')
  async signin(@Body() dto: CreateEntityDTO) {
    return await this.authService.signup(dto);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @Post('refresh')
  async refresh(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.generateToken(request.user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return { user_auth_status: true };
  }
}
