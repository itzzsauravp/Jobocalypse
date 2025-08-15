import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import {
  GenericOAuthEntity,
  GoogleOAuthProfile,
} from '../interface/auth.interface';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }
  validate(
    _accessToken,
    _refreshToken,
    profile: GoogleOAuthProfile,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;

    const user: GenericOAuthEntity = {
      provider: 'google',
      providerID: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      profilePic: photos[0].value,
    };
    done(null, user);
  }
}
