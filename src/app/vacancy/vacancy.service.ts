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
import {
  Applicant,
  Vacancy,
  VACANCY_LEVEL,
  VACANCY_TYPE,
} from 'generated/prisma';
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
        isDeleted: false,
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
  ): Promise<PaginatedData<Array<Vacancy>>> {
    const { page, limit, active } = dto;
    const skip = (page - 1) * limit;
    const vacancies = await this.prismaService.vacancy.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        assets: { where: { type: 'IMAGE' } },
        business: { include: { assets: { where: { type: 'PROFILE_PIC' } } } },
        _count: {
          select: { applicant: true },
        },
      },
      where: {
        businessID,
        isDeleted: false,
        ...(active && { isActive: active }),
      },
    });
    const totalCount = await this.prismaService.vacancy.count({
      where: {
        isDeleted: false,
        businessID,
      },
    });
    return {
      data: vacancies,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
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

  async applyForVacancy(vacancyID: string, userID: string) {
    const user = await this.userService.findByID(userID);
    if (!user.cv) throw new BadRequestException('User has no CV uploaded');
    const existingApplication = await this.prismaService.applicant.findFirst({
      where: {
        AND: {
          userID,
          vacancyID,
        },
      },
    });
    if (existingApplication) throw new BadRequestException('Already Applied ');
    try {
      const vacancyApplication = await this.prismaService.applicant.create({
        data: {
          userID,
          cv_link: user.cv.secureUrl,
          vacancyID,
        },
      });
      return vacancyApplication;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error while applying for vacancy',
      );
    }
  }

  async getVacancyApplicants(
    vacancyID: string,
    businessID: string,
    query: QueryFitlers,
  ): Promise<PaginatedData<Applicant[]>> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    const vacancy = await this.findByID(vacancyID);
    const totalCount = await this.prismaService.applicant.count({
      where: {
        vacancyID,
      },
    });
    if (vacancy.businessID !== businessID) throw new UnauthorizedException();
    const applicant = await this.prismaService.applicant.findMany({
      where: {
        vacancyID,
      },
      skip,
      take: limit,
      include: { user: true },
    });
    return {
      data: applicant,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
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
    console.log(dto);
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

  async searchVacancies(q: string) {
    const query = `

    SELECT
  v.id,
  v.title,
  v.description,
  v.tags,
  v.deadline,
  v.type,
  v.level,
  v."businessID",
  ts_rank(v.search_vector, plainto_tsquery($1)) AS rank,

  -- Vacancy assets of type IMAGE
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'id', va.id,
        'secureUrl', va."secureUrl",
        'publicId', va."publicId",
        'type', va.type,
        'format', va.format,
        'uploadedAt', va."uploadedAt"
      )
    ) FILTER (WHERE va.id IS NOT NULL),
    '[]'
  ) AS assets,

  -- Business info including PROFILE_PIC assets
  jsonb_build_object(
    'id', b.id,
    'name', b.name,
    'username', b.username,
    'website', b.website,
    'email', b.email,
    'description', b.description,
    'address', b.address,
    'phoneNumber', b."phoneNumber",
    'status', b.status,
    'isVerified', b."isVerified",
    'isDeleted', b."isDeleted",
    'verifiedAt', b."verifiedAt",
    'assets', COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', ba.id,
          'secureUrl', ba."secureUrl",
          'publicId', ba."publicId",
          'type', ba.type,
          'format', ba.format,
          'uploadedAt', ba."uploadedAt"
        )
      ) FILTER (WHERE ba.id IS NOT NULL),
      '[]'
    )
  ) AS business

FROM "Vacancy" v
LEFT JOIN "VacancyAssets" va ON va."vacancyID" = v.id AND va.type = 'image'
LEFT JOIN "Business" b ON b.id = v."businessID"
LEFT JOIN "BusinessAssets" ba ON ba."businessID" = b.id AND ba.type = 'profile_pic'

WHERE v.search_vector @@ plainto_tsquery($1)
  AND v."isActive" = true
  AND v."isDeleted" = false

GROUP BY v.id, b.id
ORDER BY rank DESC
LIMIT 50;


    `;

    const data = await this.prismaService.$queryRawUnsafe(query, q);
    return data;
  }

  // async searchVacancies(dto: QueryFitlers) {
  //   const { page, limit, q } = dto;
  //   const skip = (page - 1) * limit;
  //   // let cachedVacancies = await this.cacheService.get<Array<Vacancy>>(
  //   //   `${GENERIC_ALL_VACANCIES_CACHE}:${JSON.stringify(dto)}`,
  //   // );
  //   // if (!cachedVacancies) {
  //   const vacancies = await this.prismaService.vacancy.findMany({
  //     skip,
  //     take: 10,
  //     orderBy: { createdAt: 'desc' },
  //     include: {
  //       assets: { where: { type: 'IMAGE' } },
  //       business: { include: { assets: { where: { type: 'PROFILE_PIC' } } } },
  //     },
  //     where: {
  //       isDeleted: false,
  //       isActive: true,
  //       OR: [
  //         { title: { contains: q, mode: 'insensitive' } },
  //         { description: { contains: q, mode: 'insensitive' } },
  //         { tags: { has: q } },
  //         { level: { has: q as VACANCY_LEVEL } },
  //         { type: q as VACANCY_TYPE },
  //       ],
  //     },
  //   });
  //   //   cachedVacancies = vacancies;
  //   //   if (vacancies) {
  //   //     await this.cacheService.set(
  //   //       `${GENERIC_ALL_VACANCIES_CACHE}:${JSON.stringify(dto)}`,
  //   //       vacancies,
  //   //     );
  //   //   }
  //   // }
  //   const totalCount = await this.prismaService.vacancy.count();
  //   return {
  //     // data: cachedVacancies,
  //     data: vacancies,
  //     totalCount,
  //     currentPage: page,
  //     totalPages: Math.ceil(totalCount / limit),
  //   };
  // }
}
