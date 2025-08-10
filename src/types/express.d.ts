import 'express';
import { User } from 'src/user/interface/user-interface';

declare module 'express' {
  export interface Request {
    cookie: { [key: string]: string };
    user: User;
  }
}
