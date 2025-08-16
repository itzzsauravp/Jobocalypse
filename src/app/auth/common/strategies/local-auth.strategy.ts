import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { AuthService } from '../../auth.service';
import { Role } from 'src/common/interfaces/role.inteface';
import { ValidatedEntity } from '../interface/auth.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }
  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<ValidatedEntity> {
    const authEntity = request.authEntity as Role;
    const entity = await this.authService.validateEntity(
      authEntity,
      email,
      password,
    );
    return entity;
  }
}
