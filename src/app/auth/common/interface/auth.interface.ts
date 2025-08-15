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

export interface GithubOAuthProfile {
  id: string;
  nodeId: string;
  displayName: string;
  username: string;
  profileUrl: string;
  photos: { value: string }[];
  provider: 'github';
  _raw: string;
  _json: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: 'User';
    user_view_type: string;
    site_admin: boolean;
    name: string;
    company: string | null;
    blog: string;
    location: string;
    email: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username: string | null;
    notification_email: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  };
  emails: { value: string }[];
}

export interface GenericOAuthEntity {
  provider: string;
  providerID: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}
