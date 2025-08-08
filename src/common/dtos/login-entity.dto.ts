import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginEntityDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
