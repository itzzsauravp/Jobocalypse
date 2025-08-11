import { Role } from 'src/common/interfaces/role.inteface';

export interface TokenPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  type: Role;
}

export interface LoginReturn<T> {
  access_token: string;
  refresh_token: string;
  data: T;
}

export interface UserPropOnRequest {
  id: string;
  email: string;
  type: Role;
}
