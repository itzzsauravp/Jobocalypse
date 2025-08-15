import { IsEmail, IsString } from 'class-validator';

export class CreateUserOAuthDTO {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  profilePic: string;

  @IsString()
  provider: string;

  @IsString()
  providerID: string;
}
