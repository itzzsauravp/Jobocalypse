import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVacancyDTO } from './dtos/create-vacancy.dto';
import { UpdateVacancyDTO } from './dtos/update-vacancy.dto';
import { Vacancy } from 'generated/prisma';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { VacancyAssetsService } from 'src/assets/vacancy/vacancy-assets.service';
import { BusinessService } from '../business/business.service';
import {
  AdminQueryFilters,
  PaginationDTO,
  QueryFitlers,
} from 'src/common/dtos/pagination.dto';
import { CacheService } from 'src/cache/cache.service';
import {
  ADMIN_ALL_VACANCIES_CACHE,
  GENERIC_ALL_VACANCIES_CACHE,
} from 'src/cache/cache.constants';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class VacancyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly businessService: BusinessService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly vacancyAssetsService: VacancyAssetsService,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  ) {}

  async findAll(
    dto: AdminQueryFilters,
  ): Promise<PaginatedData<Array<Vacancy>>> {
    const { limit, page, deleted, active } = dto;
    const skip = (page - 1) * limit;
    // let cachedVacancies = await this.cacheService.get<Array<Vacancy>>(
    //   `${ADMIN_ALL_VACANCIES_CACHE}:${JSON.stringify(dto)}`,
    // );
    // if (!cachedVacancies) {
    const vacancies = await this.prismaService.vacancy.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: {
        ...(deleted && { isDeleted: deleted }),
        ...(active && { isActive: active }),
      },
      include: { business: true },
    });
    //   cachedVacancies = vacancies;
    //   if (vacancies) {
    //     await this.cacheService.set(
    //       `${ADMIN_ALL_VACANCIES_CACHE}:${JSON.stringify(dto)}`,
    //       vacancies,
    //     );
    //   }
    // }
    const totalCount = await this.prismaService.vacancy.count();
    return {
      // data: cachedVacancies,
      data: vacancies,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findAllGeneric(
    dto: PaginationDTO,
  ): Promise<PaginatedData<Array<Vacancy>>> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    // let cachedVacancies = await this.cacheService.get<Array<Vacancy>>(
    //   `${GENERIC_ALL_VACANCIES_CACHE}:${JSON.stringify(dto)}`,
    // );
    // if (!cachedVacancies) {
    const vacancies = await this.prismaService.vacancy.findMany({
      skip,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        assets: { where: { type: 'IMAGE' } },
        business: { include: { assets: { where: { type: 'PROFILE_PIC' } } } },
      },
      where: {
        isActive: true,
      },
    });
    //   cachedVacancies = vacancies;
    //   if (vacancies) {
    //     await this.cacheService.set(
    //       `${GENERIC_ALL_VACANCIES_CACHE}:${JSON.stringify(dto)}`,
    //       vacancies,
    //     );
    //   }
    // }
    const totalCount = await this.prismaService.vacancy.count();
    return {
      // data: cachedVacancies,
      data: vacancies,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findByID(vacancyID: string): Promise<Vacancy> {
    const vacancy = await this.prismaService.vacancy.findUnique({
      where: {
        id: vacancyID,
      },
      include: {
        assets: true,
        business: {
          include: {
            owner: true,
            assets: true,
          },
        },
      },
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async listBusinessVacancies(
    businessID: string,
    dto: QueryFitlers,
  ): Promise<Array<Vacancy>> {
    const { page, limit, active } = dto;
    const skip = (page - 1) * limit;
    return await this.prismaService.vacancy.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: {
        businessID,
        isDeleted: false,
        ...(active && { isActive: active }),
      },
    });
  }

  async createVacancy(
    userID: string,
    businessID: string,
    dto: CreateVacancyDTO,
    images: Array<Express.Multer.File>,
  ): Promise<Vacancy> {
    let cloudinaryResult: UploadApiResponse[] = [];
    let vacancy: Vacancy | undefined;
    const user = await this.userService.findByID(userID);
    if (!user.isBusinessAccount)
      throw new UnauthorizedException('this is not a business account');
    const business = await this.businessService.findByID(businessID);
    if (business.status !== 'APPROVED')
      throw new UnauthorizedException('business account not approved');
    try {
      vacancy = await this.prismaService.vacancy.create({
        data: {
          businessID,
          title: dto.title,
          description: dto.description,
          deadline: dto.deadline,
          tags: dto.tags,
          type: dto.type,
          level: dto.level,
        },
      });
      if (images) {
        cloudinaryResult = (await this.cloudinaryService.multiFileUpload(
          images,
          'assets',
          'vacancy',
          vacancy.id,
        )) as UploadApiResponse[];
      }
      if (cloudinaryResult.length) {
        await this.vacancyAssetsService.saveVacancyAssets(
          vacancy.id,
          cloudinaryResult,
        );
      }
      return vacancy;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        if (vacancy) {
          await this.prismaService.vacancy.delete({
            where: { id: vacancy.id },
          });
          await this.prismaService.vacancyAssets.deleteMany({
            where: { vacancyID: vacancy.id },
          });
        }
        await this.cloudinaryService.bulkDeleteFiles(
          cloudinaryResult.map((cr) => cr.public_id),
        );
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async updateVacancy(
    businessID: string,
    vacancyID: string,
    dto: UpdateVacancyDTO,
  ): Promise<Vacancy> {
    const vacancyToUpdate = await this.findByID(vacancyID);
    if (businessID !== vacancyToUpdate.businessID) {
      throw new UnauthorizedException();
    }
    const updatedVacancy = await this.prismaService.vacancy.update({
      where: {
        id: vacancyID,
      },
      data: dto,
    });
    if (updatedVacancy) {
      this.cacheService.deleteByPattern(`${ADMIN_ALL_VACANCIES_CACHE}`);
    }
    return updatedVacancy;
  }

  async updateDeletionStatus(
    vacancyID: string,
    status: boolean,
  ): Promise<Vacancy> {
    const deletedVacancy = await this.prismaService.vacancy.update({
      where: {
        id: vacancyID,
      },
      data: {
        isDeleted: status,
      },
    });
    if (deletedVacancy) {
      this.cacheService.deleteByPattern(`${ADMIN_ALL_VACANCIES_CACHE}`);
    }
    return deletedVacancy;
  }

  async bulkUpdateDeletionStatus(vacancyIDs: string[], status: boolean) {
    const result = await this.prismaService.vacancy.updateMany({
      data: { isDeleted: status },
      where: { id: { in: vacancyIDs } },
    });
    return `${result.count} vacancies delete status set to ${status}`;
  }

  async deleteVacancy(businessID: string, vacancyID: string): Promise<Vacancy> {
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
