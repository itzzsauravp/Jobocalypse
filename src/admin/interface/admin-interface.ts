export interface Admin {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string | null;
  phoneNumber?: string | null;
  refreshToken?: string | null;
}
