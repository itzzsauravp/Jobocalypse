import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { FirmAuthService } from '../firm-auth.service';
import { Firm } from 'src/firm/interface/firm-interface';

@Injectable()
export class FirmLocalStrategy extends PassportStrategy(
  Strategy,
  'firm-local',
) {
  constructor(private readonly firmAuthService: FirmAuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<Firm> {
    return await this.firmAuthService.validateFirm(email, password);
  }
}
