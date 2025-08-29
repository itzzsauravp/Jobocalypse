import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateBusinessAccDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;
}
