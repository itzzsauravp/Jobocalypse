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
