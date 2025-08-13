import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthServiceRegistry } from '../../registry/auth-service.registry';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly genericAuthService: AuthServiceRegistry) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }
  async validate(request: Request, email: string, password: string) {
    const authEntity = request.authEntity;
    const service = this.genericAuthService.getService(authEntity);
    return await service.validateEntity(email, password);
  }
}
