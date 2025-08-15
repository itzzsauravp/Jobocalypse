import { IsString } from 'class-validator';

export class CreateDocumentDTO {
  @IsString()
  secureURL: string;

  @IsString()
  publicID: string;

  @IsString()
  type: string;

  @IsString()
  format: string;
}
