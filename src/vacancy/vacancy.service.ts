import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async listFirmsVacancies(id: string): Promise<Array<Vacancy>> {
    return await this.prismaService.vacancy.findMany({
      where: {
        firmID: id,
      },
    });
  }

  async createVacancy(id: string, dto: CreateVacancyDTO): Promise<Vacancy> {
    const vacancy = await this.prismaService.vacancy.create({
      data: {
        firmID: id,
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline,
        tags: dto.tags,
        type: dto.type,
      },
    });
    return vacancy;
  }

  async updateVacancy(firmID: string, id: string, dto: UpdateVacancyDTO) {
    const vacancyToUpdate = await this.findVacancyByID(id);
    if (firmID !== vacancyToUpdate.firmID) {
      throw new UnauthorizedException();
    }
    return await this.prismaService.vacancy.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async deleteVacancyAdmin(id: string): Promise<Vacancy> {
    return await this.prismaService.vacancy.delete({
      where: {
        id,
      },
    });
  }

  async deleteVacancy(id: string, idFromRequest: string): Promise<Vacancy> {
    const vacancyToDelte = await this.findVacancyByID(id);
    if (idFromRequest !== vacancyToDelte.firmID) {
      throw new UnauthorizedException();
    }
    return await this.prismaService.vacancy.delete({
      where: {
        id,
      },
    });
  }
}
