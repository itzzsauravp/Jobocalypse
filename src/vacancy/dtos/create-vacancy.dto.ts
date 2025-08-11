import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
import { VacancyEnum } from 'src/common/interfaces/vacancy-type.enum';

export class CreateVacancyDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @IsEnum(VacancyEnum)
  type: VacancyEnum;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
