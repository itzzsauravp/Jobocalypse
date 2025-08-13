import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { VACANCY_ENUM } from 'generated/prisma';

export class UpdateVacancyDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @IsOptional()
  @IsEnum(VACANCY_ENUM)
  type: VACANCY_ENUM;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
