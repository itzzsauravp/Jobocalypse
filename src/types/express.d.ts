import 'express';
import { User } from 'src/auth/common/auth.inteface';

declare module 'express' {
  export interface Request {
    cookie: { [key: string]: string };
    user: User;
  }
}
