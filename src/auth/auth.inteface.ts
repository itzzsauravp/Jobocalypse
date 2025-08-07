export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string | null;
  phoneNumber?: string | null;
  isVerified: boolean;
  refreshToken?: string | null;
  isDeleted: boolean;
}

export interface TokenPayload {
  sub: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginReturn {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface UserPropOnRequest {
  userID: number;
  email: string;
}
