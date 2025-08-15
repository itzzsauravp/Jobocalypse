import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import {
  GenericOAuthEntity,
  GithubOAuthProfile,
} from '../interface/auth.interface';

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }
  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GithubOAuthProfile,
    done,
  ) {
    const user: GenericOAuthEntity = {
      provider: profile.provider,
      providerID: profile.id,
      firstName: profile.displayName.split(' ')[0],
      lastName: profile.displayName.split(' ')[1],
      profilePic: profile.photos[0].value,
      email: profile.emails[0].value,
    };
    done(null, user);
  }
}
