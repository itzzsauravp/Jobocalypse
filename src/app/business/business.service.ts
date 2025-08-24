import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBusinessAccDTO } from './dtos/create-business-acc.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Business, Prisma, STATUS } from 'generated/prisma';
import { UpdateBusinessAccDTO } from './dtos/update-business-acc.dto';
import { AdminQueryFilters } from 'src/common/dtos/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { BusinessAssetsService } from 'src/assets/business/business-assets.service';
import { CacheService } from 'src/cache/cache.service';
import { ADMIN_ALL_BUSINESSES_CACHE } from 'src/cache/cache.constants';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';

@Injectable()
export class BusinessService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clodinaryService: CloudinaryService,
    private readonly businessAssetsService: BusinessAssetsService,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(
    dto: AdminQueryFilters,
  ): Promise<PaginatedData<Array<Business>>> {
    const { page, limit, verified, deleted } = dto;
    const skip = (page - 1) * limit;
    const totalCount = await this.prismaService.business.count();
    // let cachedBusinesses: Array<Business> | null = await this.cacheService.get(
    //   `${ADMIN_ALL_BUSINESSES_CACHE}:${JSON.stringify(dto)}`,
    // );
    // if (!cachedBusinesses) {
    const businesses = await this.prismaService.business.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: {
        ...(deleted && { isDeleted: deleted }),
        ...(verified && { isDeleted: verified }),
      },
      include: { owner: true },
    });
    //   cachedBusinesses = businesses;
    //   if (businesses) {
    //     await this.cacheService.set(
    //       `${ADMIN_ALL_BUSINESSES_CACHE}:${JSON.stringify(dto)}`,
    //       businesses,
    //     );
    //   }
    // }
    return {
      // data: cachedBusinesses,
      data: businesses,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findByOwnerID(
    userID: string,
    includeDocuments: boolean = false,
  ): Promise<Business | null> {
    const business = await this.prismaService.business.findUnique({
      where: {
        userID,
      },
      ...(includeDocuments && {
        include: { assets: { where: { type: 'DOCUMENT' } } },
      }),
    });
    if (!business) return null;
    return business;
  }

  async findByID(
    businessID: string,
    includeDocuments: boolean = false,
  ): Promise<Business> {
    const business = await this.prismaService.business.findUnique({
      where: {
        id: businessID,
      },
      include: {
        assets: includeDocuments,
        owner: {
          include: {
            assets: {
              where: { type: 'PROFILE_PIC' },
              take: 1,
              orderBy: { uploadedAt: 'desc' },
            },
          },
        },
      },
    });
    if (!business) throw new BadRequestException('Business doesnot exists');
    return business;
  }

  async create(
    id: string,
    dto: CreateBusinessAccDTO,
    files: Array<Express.Multer.File>,
  ) {
    if (!files.length) {
      throw new BadRequestException(
        'Documents missing, Please pass the required documents',
      );
    }
    const existingBusiness = await this.findByOwnerID(id);
    if (existingBusiness)
      throw new BadRequestException('The user already owns a business account');
    const cloudinaryResult = (await this.clodinaryService.multiFileUpload(
      files,
      'documents',
      'user',
      id,
    )) as UploadApiResponse[];
    try {
      const result = await this.prismaService.$transaction(
        async (tsx: Prisma.TransactionClient) => {
          const business = await tsx.business.create({
            data: {
              owner: { connect: { id } },
              address: dto.address,
              description: dto.description,
              name: dto.name,
              phoneNumber: dto.phoneNumber,
              website: dto.website,
            },
          });
          await this.businessAssetsService.saveDocumentsInBulk(
            tsx,
            business.id,
            cloudinaryResult,
          );
          return business;
        },
      );
      return {
        account: result,
        message: 'verification pending from admin',
      };
    } catch {
      await this.clodinaryService.bulkDeleteFiles(
        cloudinaryResult.map((item) => item.public_id),
      );
      throw new InternalServerErrorException(
        'Something went wrong! Try again later',
      );
    }
  }

  async delete(userID: string) {
    return await this.prismaService.business.update({
      where: { userID },
      data: { isDeleted: true },
    });
  }

  async update(userID: string, dto: UpdateBusinessAccDTO) {
    return await this.prismaService.business.update({
      where: { userID },
      data: {
        website: dto.website,
        description: dto.description,
        address: dto.address,
        phoneNumber: dto.phoneNumber,
      },
    });
  }

  async updateVerificationStatus(businessID: string, status: boolean) {
    return await this.prismaService.business.update({
      where: { id: businessID },
      data: {
        isVerified: status,
        verifiedAt: status ? new Date().toISOString() : null,
      },
    });
  }

  async updateDeletionStatus(businessID: string, status: boolean) {
    return await this.prismaService.business.update({
      where: { id: businessID },
      data: { isDeleted: status },
    });
  }

  async updateStatus(businessID: string, status: STATUS) {
    return await this.prismaService.business.update({
      where: { id: businessID },
      data: { status },
    });
  }

  async bulkUpdateVerificationStatus(
    businessIDs: Array<string>,
    status: boolean,
  ) {
    const result = await this.prismaService.business.updateMany({
      data: {
        isVerified: status,
        verifiedAt: status ? new Date().toISOString() : null,
      },
      where: { id: { in: businessIDs } },
    });
    return `${result.count} business verification status set to ${status}`;
  }

  async bulkUpdateDeletionStatus(businessIDs: Array<string>, status: boolean) {
    const result = await this.prismaService.business.updateMany({
      data: {
        isDeleted: status,
      },
      where: { id: { in: businessIDs } },
    });
    return `${result.count} business deletion status set to ${status}`;
  }

  async bulkUpdateStatus(businessIDs: Array<string>, status: STATUS) {
    return this.prismaService.business.updateMany({
      data: {
        status,
      },
      where: { id: { in: businessIDs } },
    });
  }
}
