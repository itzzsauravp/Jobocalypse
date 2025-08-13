import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/interfaces/role.inteface';

export const AUTH_ENTITY = 'AUTH_ENTITY';

export const AuthEntity = (entity: Role) => SetMetadata(AUTH_ENTITY, entity);
