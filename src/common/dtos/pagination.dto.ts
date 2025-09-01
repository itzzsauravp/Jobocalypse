import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class PaginationDTO {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Max(100)
  limit: number = 10;
}

export class QueryFitlers extends PaginationDTO {
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  q?: string;
}

export class AdminQueryFilters extends QueryFitlers {
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  business?: boolean;
}
