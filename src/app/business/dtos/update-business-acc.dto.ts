import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateBusinessAccDTO {
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

  @IsArray()
  @IsString()
  documents: string[];
}
