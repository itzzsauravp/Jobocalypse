import 'express';
import { User } from 'src/app/user/interface/user.interface';
import { Role } from 'src/common/interfaces/role.inteface';

declare module 'express' {
  export interface Request {
    cookie: { [key: string]: string };
    user: User;
    authEntity: Role;
  }
}
