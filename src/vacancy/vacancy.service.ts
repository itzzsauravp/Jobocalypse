import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Vacancy } from './interface/vacancy.interface';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';

@Injectable()
export class VacancyService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllVacancy(): Promise<Array<Vacancy>> {
    return await this.prismaService.vacancy.findMany();
  }

  async findVacancyByID(id: string): Promise<Vacancy> {
    const vacancy = await this.prismaService.vacancy.findUnique({
      where: {
        id,
      },
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async createVacancy(id: string, dto: CreateVacancyDTO): Promise<Vacancy> {
    const vacancy = await this.prismaService.vacancy.create({
      data: {
        firmID: id,
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline,
        tags: dto.tags,
      },
    });
    return vacancy;
  }

  async updateVacancy(id: string, dto: UpdateVacancyDTO) {
    const vacancy = await this.prismaService.vacancy.update({
      where: {
        id,
      },
      data: dto,
    });
    return vacancy;
  }

  async deleteVacancy(id: string): Promise<Vacancy> {
    const vacancy = await this.prismaService.vacancy.delete({
      where: {
        id,
      },
    });
    return vacancy;
  }
}
