import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { Vacancy } from 'generated/prisma';

@Injectable()
export class VacancyService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllVacancy(dto: PaginationDTO): Promise<Array<Vacancy>> {
    const { limit, page } = dto;
    const skip = (page - 1) * limit;
    return await this.prismaService.vacancy.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
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

  async listBusinessVacancies(id: string): Promise<Array<Vacancy>> {
    return await this.prismaService.vacancy.findMany({
      where: {
        businessID: id,
      },
    });
  }

  async createVacancy(id: string, dto: CreateVacancyDTO): Promise<Vacancy> {
    const vacancy = await this.prismaService.vacancy.create({
      data: {
        businessID: id,
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
    if (firmID !== vacancyToUpdate.businessID) {
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
    if (idFromRequest !== vacancyToDelte.businessID) {
      throw new UnauthorizedException();
    }
    return await this.prismaService.vacancy.delete({
      where: {
        id,
      },
    });
  }
}
