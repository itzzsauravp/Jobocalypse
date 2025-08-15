import 'express';
import {
  GenericOAuthEntity,
  ValidatedEntity,
} from 'src/app/auth/common/interface/auth.interface';

declare module 'express' {
  export interface Request {
    cookie: { [key: string]: string };
    entity: ValidatedEntity;
    authEntity: Role;
    user: GenericOAuthEntity;
  }
}
