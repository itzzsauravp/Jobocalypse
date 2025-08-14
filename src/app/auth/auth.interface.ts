import { Role } from 'src/common/interfaces/role.inteface';

export interface TokenPayload {
  sub: string;
  email: string;
  type: Role;
}

export interface LoginReturn<T> {
  access_token: string;
  refresh_token: string;
  data: T;
}

export interface ValidatedEntity {
  id: string;
  email: string;
  type: Role;
}

export interface GoogleOAuthProfile {
  provider: 'google';
  sub: string;
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  given_name: string;
  family_name: string;
  email_verified: boolean;
  verified: boolean;
  email: string;
  emails: {
    value: string;
    type: string;
  }[];
  photos: {
    value: string;
    type: string;
  }[];
  picture: string;
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
}

export interface GenericOAuthEntity {
  provider: string;
  providerID: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}
