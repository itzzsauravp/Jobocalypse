import { Role } from 'src/common/interfaces/role.inteface';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string | null;
  phoneNumber?: string | null;
  worksAtID?: string | null;
  isVerified: boolean;
  refreshToken?: string | null;
  isDeleted: boolean;
  profilePic: string | null;
  publicID: string | null;

  type: Role; // where dafaq did this come from (big mistake chat big mistake)
}
