import 'express';

declare module 'express' {
  export interface Request {
    cookie: { [key: string]: string };
  }
}
