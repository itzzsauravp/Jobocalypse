import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';

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
