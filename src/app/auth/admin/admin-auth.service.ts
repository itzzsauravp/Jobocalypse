import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/app/admin/admin.service';
import {
  TokenPayload,
  ValidatedEntity,
} from '../common/interface/auth.interface';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async validateEntity(
    email: string,
    password: string,
  ): Promise<ValidatedEntity> {
    const user = await this.adminService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentails');
    }
    const isPasswordValid =
      user.password && (await compare(password, user.password));
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentails');
    }
    return { id: user.id, email: user.email, type: 'user' };
  }

  me(access_token: string, refres_token: string) {
    const token = access_token ?? refres_token;
    if (token) {
      const payload = this.jwtService.decode<TokenPayload>(access_token);

      return this.adminService.findByID(payload.sub);
    }
    throw new UnauthorizedException('user not autheticated');
  }

  async generateToken(entity: ValidatedEntity, response: Response) {
    const payload: TokenPayload = {
      sub: entity.id,
      email: entity.email,
      type: 'admin',
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY',
      )}d`,
    });
    await this.adminService.update(entity.id, {
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

    const admin = await this.adminService.findByID(entity.id);
    return {
      access_token,
      refresh_token,
      data: admin,
    };
  }

  async logout(id: string, response: Response) {
    try {
      await this.adminService.update(id, { refreshToken: null });
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return { message: error.message };
      }
    }
  }
}
