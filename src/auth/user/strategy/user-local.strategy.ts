import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserAuthService } from '../user-auth.service';
import { User } from 'src/user/interface/user.interface';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(
  Strategy,
  'user-local',
) {
  constructor(private readonly userAuthService: UserAuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<Omit<User, 'type'>> {
    return await this.userAuthService.validateUser(email, password);
  }
}
