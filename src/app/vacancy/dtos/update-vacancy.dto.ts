import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { VACANCY_LEVEL, VACANCY_TYPE } from 'generated/prisma';

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
  @IsEnum(VACANCY_TYPE)
  type: VACANCY_TYPE;

  @IsOptional()
  @IsArray()
  @IsEnum(VACANCY_LEVEL, { each: true })
  level: VACANCY_LEVEL[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
