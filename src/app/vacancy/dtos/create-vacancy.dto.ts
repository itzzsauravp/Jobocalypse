import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
import { VACANCY_LEVEL, VACANCY_TYPE } from 'generated/prisma';

export class CreateVacancyDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @IsEnum(VACANCY_TYPE)
  type: VACANCY_TYPE;

  @IsArray()
  @IsEnum(VACANCY_LEVEL)
  level: VACANCY_LEVEL[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
