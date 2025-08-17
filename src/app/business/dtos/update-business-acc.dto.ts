import { IsOptional, IsString } from 'class-validator';

export class UpdateBusinessAccDTO {
  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}
