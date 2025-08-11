import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { VacancyEnum } from 'src/common/interfaces/vacancy-type.enum';

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
  @IsEnum(VacancyEnum)
  type: VacancyEnum;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
