import { IsDate, IsString, IsStrongPassword } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFirmDTO {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  type: string;

  @Type(() => Date)
  @IsDate()
  establishedOn: Date;

  @IsString()
  phoneNumber: string;

  @IsString()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  password2: string;
}
