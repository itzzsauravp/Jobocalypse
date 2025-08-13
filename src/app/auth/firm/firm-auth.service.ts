import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { LoginEntityDTO } from 'src/common/dtos/login-entity.dto';
import { CreateFirmDTO } from 'src/app/firm/dtos/create-firm.dto';
import { FirmService } from 'src/app/firm/firm.service';

@Injectable()
export class FirmAuthService {
  constructor(
    private readonly firmService: FirmService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateFirm(email: string, password: string) {
    const firm = await this.firmService.findFirmByEmail(email);
    if (!firm || firm.isDeleted) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const isPasswordValid = await compare(password, firm.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return firm;
  }

  async signup(dto: CreateFirmDTO) {
    if (dto.password !== dto.password2) {
      throw new BadRequestException(
        'Password does not match the confirm password',
      );
    }
    const firmExists = await this.firmService.findFirmExits(dto.email);
    if (firmExists) throw new ConflictException('Email is already registered');
    try {
      const user = this.firmService.createFrim(dto);
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create account');
    }
  }

  async generateToken(dto: LoginEntityDTO, response: Response) {
    const firm = await this.firmService.findFirmByEmail(dto.email);
    const payload = {
      sub: firm.id,
      email: firm.email,
      name: firm.name,
      type: 'firm',
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY',
      )}d`,
    });
    const updatedFirm = await this.firmService.udpateFirm(firm.id, {
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
      data: updatedFirm,
    };
  }
}
