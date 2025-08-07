import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type Request as ExpRequest, type Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginReturn, User } from './auth.inteface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignInDTO } from './dto/sign-in.dto';
import { JwtAuthRefreshGuard } from './guards/jwt-auth-refresh.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @ResponseMessage('Login Successful')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginReturn> {
    return await this.authService.generateToken(request.user as User, response);
  }

  @Post('signin')
  async signin(@Body() dto: SignInDTO) {
    return await this.authService.signup(dto);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @Post('refresh')
  async refresh(
    @Request() request: ExpRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.generateToken(request.user as User, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return { auth_status: true };
  }
}
