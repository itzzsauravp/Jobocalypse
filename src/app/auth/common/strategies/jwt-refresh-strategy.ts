import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request as ExpRequest } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload, ValidatedEntity } from '../../auth.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: ExpRequest) => {
          return request.cookies.refresh_token as string;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  validate(payload: TokenPayload): ValidatedEntity {
    return { id: payload.sub, email: payload.email, type: payload.type };
  }
}
