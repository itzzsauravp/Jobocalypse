import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/user/user.service';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcryptjs';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { LoginEntityDTO } from 'src/common/dtos/login-entity.dto';
import { BaseLocalAuthService } from '../interface/base-local-auth-service.interface';
import { User } from 'src/app/user/interface/user.interface';

@Injectable()
export class UserAuthService
  implements BaseLocalAuthService<Omit<User, 'type'>>
{
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateEntity(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return user;
  }

  async signup(dto: CreateEntityDTO) {
    if (dto.password !== dto.password2) {
      throw new BadRequestException(
        'Password does not match the confirm password',
      );
    }
    const userExists = await this.userService.findUserExists(dto.email);
    if (userExists) throw new ConflictException('Email is already registered');
    try {
      const user = this.userService.createUser(dto);
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create accont');
    }
  }

  async generateToken(dto: LoginEntityDTO, response: Response) {
    const user = await this.userService.findUserByEmail(dto.email);
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: 'user',
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY',
      )}d`,
    });
    const updatedUser = await this.userService.updateUser(user.id, {
      refreshToken: await hash(refresh_token, 10),
    });

    const accessTokenExpirationTimeMinutes = Number(
      this.configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME_MIN',
      ),
    );
    const refreshTokenExpirationTimeDays = Number(
      this.configService.getOrThrow<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY',
      ),
    );

    response.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: accessTokenExpirationTimeMinutes * 60 * 1000,
      secure: this.configService.get('NODE_ENV') === 'production',
    });
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: refreshTokenExpirationTimeDays * 24 * 60 * 60 * 1000,
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    return {
      access_token,
      refresh_token,
      data: updatedUser,
    };
  }
}
