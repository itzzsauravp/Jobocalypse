import { IsArray, IsBoolean, IsString } from 'class-validator';
import { ASSETS_TYPE } from 'generated/prisma';

export class QueryFilters {
  @IsBoolean()
  assets: boolean = false;

  @IsArray()
  @IsString()
  type: ASSETS_TYPE[] = ['DOCUMENT'];

  @IsBoolean()
  owner: boolean = false;
}
