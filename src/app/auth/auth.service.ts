import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FirmService } from '../firm/firm.service';
import { AdminService } from '../admin/admin.service';
import { Role } from 'src/common/interfaces/role.inteface';
import { compare, hash } from 'bcryptjs';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateFirmDTO } from '../firm/dtos/create-firm.dto';
import { GenericOAuthEntity, ValidatedEntity } from './auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../user/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly firmService: FirmService,
    private readonly adminService: AdminService,
    private readonly prismaService: PrismaService,
  ) {}
  resolveEntity(entity: Role) {
    switch (entity) {
      case 'admin':
        return this.adminService;
      case 'firm':
        return this.firmService;
      case 'user':
        return this.userService;
    }
  }
  async validateEntity(
    type: Role,
    email: string,
    password: string,
  ): Promise<ValidatedEntity> {
    const entity = await this.resolveEntity(type).findByEmail(email);
    if (!entity) {
      throw new UnauthorizedException('Invalid Credentails');
    }
    const isPasswordValid =
      entity.password && (await compare(password, entity.password));
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentails');
    }
    return { id: entity.id, email: entity.email, type };
  }

  async signup(type: Role, dto: CreateEntityDTO | CreateFirmDTO) {
    if (dto.password !== dto.password2) {
      throw new BadRequestException(
        'Password does not match the confirm password',
      );
    }
    const entityExists = await this.resolveEntity(type).findExists(dto.email);
    if (entityExists)
      throw new ConflictException('Email is already registered');
    try {
      if (type === 'firm') {
        return this.firmService.create(dto as CreateFirmDTO);
      } else {
        return this.userService.create(dto as CreateEntityDTO);
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create account');
    }
  }
  async generateToken(type: Role, entity: ValidatedEntity, response: Response) {
    const payload = {
      sub: entity.id,
      email: entity.email,
      type: type,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME_DAY',
      )}d`,
    });
    const updateEnity = await this.resolveEntity(type).update(entity.id, {
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
      data: updateEnity,
    };
  }

  async handleOpenAuthentication(
    entity: GenericOAuthEntity,
    response: Response,
  ) {
    let existingEntity: Omit<User, 'type'> | null;
    existingEntity = await this.userService.findByEmail(entity.email);
    if (!existingEntity) {
      existingEntity = await this.prismaService.user.create({
        data: {
          email: entity.email,
          firstName: entity.firstName,
          lastName: entity.lastName,
          profilePic: entity.profilePic,
          provider: entity.provider,
          providerID: entity.providerID,
        },
      });
    }
    return this.generateToken(
      'user',
      { email: entity.email, id: existingEntity.id, type: 'user' },
      response,
    );
  }
}
