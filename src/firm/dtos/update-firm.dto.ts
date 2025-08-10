import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFirmDTO {
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
}
