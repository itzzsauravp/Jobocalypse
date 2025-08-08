import 'express';
import { User } from 'src/auth/auth.inteface';

declare module 'express' {
  export interface Request {
    cookie: { [key: string]: string };
    user: User;
  }
}
