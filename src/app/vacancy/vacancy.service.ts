import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { Vacancy } from 'generated/prisma';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { VacancyAssetsService } from 'src/assets/vacancy/vacancy-assets.service';

@Injectable()
export class VacancyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly vacancyAssetsService: VacancyAssetsService,
  ) {}

  async findAll(dto: PaginationDTO): Promise<Array<Vacancy>> {
    const { limit, page } = dto;
    const skip = (page - 1) * limit;
    return await this.prismaService.vacancy.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByID(vacancyID: string): Promise<Vacancy> {
    const vacancy = await this.prismaService.vacancy.findUnique({
      where: {
        id: vacancyID,
      },
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async listBusinessVacancies(businessID: string): Promise<Array<Vacancy>> {
    return await this.prismaService.vacancy.findMany({
      where: {
        businessID,
      },
    });
  }

  async createVacancy(
    businessID: string,
    dto: CreateVacancyDTO,
    images: Array<Express.Multer.File>,
  ): Promise<Vacancy> {
    let cloudinaryResult: UploadApiResponse[] = [];
    try {
      const result = await this.prismaService.$transaction(async () => {
        const vacancy = await this.prismaService.vacancy.create({
          data: {
            businessID,
            title: dto.title,
            description: dto.description,
            deadline: dto.deadline,
            tags: dto.tags,
            type: dto.type,
          },
        });
        if (images) {
          cloudinaryResult = (await this.cloudinaryService.multiFileUpload(
            images,
            'assets',
            'vacancy',
            result.id,
          )) as UploadApiResponse[];
        }
        if (cloudinaryResult.length) {
          await this.vacancyAssetsService.saveVacancyAssets(
            vacancy.id,
            cloudinaryResult,
          );
        }
        return vacancy;
      });
      return result;
    } catch {
      await this.cloudinaryService.bulkDeleteFiles(
        cloudinaryResult.map((cr) => cr.public_id),
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateVacancy(
    businessID: string,
    vacancyID: string,
    dto: UpdateVacancyDTO,
  ) {
    const vacancyToUpdate = await this.findByID(vacancyID);
    if (businessID !== vacancyToUpdate.businessID) {
      throw new UnauthorizedException();
    }
    return await this.prismaService.vacancy.update({
      where: {
        id: vacancyID,
      },
      data: dto,
    });
  }

  async deleteVacancyAdmin(vacancyID: string): Promise<Vacancy> {
    return await this.prismaService.vacancy.update({
      where: {
        id: vacancyID,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async deleteVacancy(vacancyID: string, businessID: string): Promise<Vacancy> {
    const vacancyToDelte = await this.findByID(vacancyID);
    if (businessID !== vacancyToDelte.businessID) {
      throw new UnauthorizedException();
    }
    return await this.prismaService.vacancy.update({
      where: {
        id: vacancyID,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
