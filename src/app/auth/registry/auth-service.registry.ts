import { Injectable } from '@nestjs/common';
import { AdminAuthService } from '../admin/admin-auth.service';
import { FirmAuthService } from '../firm/firm-auth.service';
import { UserAuthService } from '../user/user-auth.service';
import { Role } from 'src/common/interfaces/role.inteface';
import { BaseLocalAuthService } from '../interface/base-local-auth-service.interface';

@Injectable()
export class AuthServiceRegistry {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly firmAuthService: FirmAuthService,
    private readonly userAuthService: UserAuthService,
  ) {}

  getService(entity: Role): BaseLocalAuthService<any> {
    switch (entity) {
      case 'admin':
        return this.adminAuthService;
      case 'firm':
        return this.firmAuthService;
      case 'user':
        return this.userAuthService;
      default:
        throw new Error(`Unknown entity type: ${entity as string}`);
    }
  }
}
