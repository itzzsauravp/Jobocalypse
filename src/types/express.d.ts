import 'express';
import { User } from 'generated/prisma';
import { ValidatedEntity } from 'src/app/auth/auth.interface';

declare module 'express' {
  export interface Request {
    cookie: { [key: string]: string };
    entity: ValidatedEntity;
    authEntity: Role;
    user: User;
  }
}
