export interface Firm {
  id: string;
  name: string;
  location: string;
  type: string;
  establishedOn: Date;
  phoneNumber: string;
  email: string;
  password: string;
  refreshToken?: string | null;
  isVerified: boolean;
  isDeleted: boolean;
  profilePic: string | null;
  publicID: string | null;
}
