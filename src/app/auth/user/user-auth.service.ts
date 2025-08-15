import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/app/user/user.service';
import {
  GenericOAuthEntity,
  TokenPayload,
  ValidatedEntity,
} from '../common/interface/auth.interface';
import { compare, hash } from 'bcryptjs';
import { CreateUserDTO } from 'src/app/user/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  async validateEntity(
    email: string,
    password: string,
  ): Promise<ValidatedEntity> {
    const user = await this.userService.findByEmail(email);
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

  async signup(dto: CreateUserDTO) {
    if (dto.password !== dto.password2) {
      throw new BadRequestException(
        'Password does not match the confirm password',
      );
    }
    const userExists = await this.userService.findExists(dto.email);
    if (userExists) throw new ConflictException('Email is already registered');
    try {
      return this.userService.create(dto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create account');
    }
  }
  async generateToken(entity: ValidatedEntity, response: Response) {
    const payload: TokenPayload = {
      sub: entity.id,
      email: entity.email,
      type: 'user',
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY',
      )}d`,
    });
    const updatedUser = await this.userService.update(entity.id, {
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

  async handleOpenAuthentication(
    currentProvider: string,
    oAuthUser: GenericOAuthEntity,
    response: Response,
  ) {
    const existingUser = await this.userService.upsertCreate(oAuthUser);
    if (
      (existingUser.provider == currentProvider,
      existingUser.providerID === oAuthUser.providerID)
    ) {
      return this.generateToken(
        { email: existingUser.email, id: existingUser.id, type: 'user' },
        response,
      );
    }
    throw new BadRequestException('user linked to a different OAuth provider');
  }
}
