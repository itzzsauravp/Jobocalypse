import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFirmDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  establishedOn: Date;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  email: string;
}
