import { Admin } from 'src/admin/interface/admin-interface';
import { User } from 'src/user/interface/user-interface';

export interface TokenPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginReturnUser {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginReturnAdmin {
  access_token: string;
  refresh_token: string;
  admin: Admin;
}

export interface UserPropOnRequest {
  id: string;
  email: string;
}
