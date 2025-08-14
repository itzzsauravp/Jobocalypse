import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { Role } from 'src/common/interfaces/role.inteface';
import { compare } from 'bcryptjs';
import { ValidatedEntity } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}
  resolveEntity(entity: Role) {
    switch (entity) {
      case 'admin':
        return this.adminService;
      case 'user':
        return this.userService;
      default:
        throw new Error(`Unknown entity of type ${entity as Role}`);
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
}
