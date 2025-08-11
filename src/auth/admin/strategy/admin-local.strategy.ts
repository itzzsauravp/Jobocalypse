import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminAuthService } from '../admin-auth.service';
import { Admin } from 'src/admin/interface/admin.interface';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(private readonly adminAuthService: AdminAuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<Admin> {
    return await this.adminAuthService.validateAdmin(email, password);
  }
}
