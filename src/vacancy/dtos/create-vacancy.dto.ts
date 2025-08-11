import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
import { VACANCY_ENUM } from 'generated/prisma';

export class CreateVacancyDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @IsEnum(VACANCY_ENUM)
  type: VACANCY_ENUM;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
