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
import type { Response } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { LoginEntityDTO } from 'src/common/dtos/login-entity.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminService.findAdminByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('Invalid Credentails');
    }
    const isPasswordValid = await compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentails');
    }
    return admin;
  }

  async signup(dto: CreateEntityDTO) {
    if (dto.password !== dto.password2) {
      throw new BadRequestException(
        'Password does not match the confirm password',
      );
    }
    const adminExits = await this.adminService.findAdminExists(dto.email);
    if (adminExits) throw new ConflictException('Email is already registered');
    try {
      const admin = this.adminService.createAdmin(dto);
      return admin;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create admin');
    }
  }

  async generateToken(dto: LoginEntityDTO, response: Response) {
    const admin = await this.adminService.findAdminByEmail(dto.email);
    const payload = {
      sub: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY',
      )}d`,
    });
    const updatedAdmin = await this.adminService.udpateAdmin(admin.id, {
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
      admin: updatedAdmin,
    };
  }
}
