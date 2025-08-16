import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBusinessAccDTO } from './dtos/create-business-acc.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Business, STATUS } from 'generated/prisma';
import { UpdateBusinessAccDTO } from './dtos/update-business-acc.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { BusinessAssetsService } from 'src/assets/business/business-assets.service';

@Injectable()
export class BusinessService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clodinaryService: CloudinaryService,
    private readonly businessAssetsService: BusinessAssetsService,
  ) {}

  async findAll(dto: PaginationDTO) {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const totalCount = await this.prismaService.business.count();
    const businesses = await this.prismaService.business.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return {
      data: businesses,
      totalCount,
      currentPage: page,
      totalPage: Math.ceil(totalCount / limit),
    };
  }

  async findByOwnerID(userID: string): Promise<Business> {
    const business = await this.prismaService.business.findUnique({
      where: {
        userID,
      },
    });
    if (!business)
      throw new BadRequestException('User doesnot own any business');
    return business;
  }

  async findByID(businessID: string): Promise<Business> {
    const business = await this.prismaService.business.findUnique({
      where: {
        id: businessID,
      },
    });
    if (!business) throw new BadRequestException('Business doesnot exists');
    return business;
  }

  // refech the data again ? for just documents but this a transaction so i already know the document is going to be there is i get the result.
  async create(
    id: string,
    dto: CreateBusinessAccDTO,
    files: Array<Express.Multer.File>,
  ) {
    const cloudinaryResult = (await this.clodinaryService.multiFileUpload(
      files,
      'documents',
      'user',
      id,
    )) as UploadApiResponse[];
    try {
      const result = await this.prismaService.$transaction(async () => {
        const business = await this.prismaService.business.create({
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
          business.id,
          cloudinaryResult,
        );
        return business;
      });
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

  async delete(businessID: string) {
    return await this.prismaService.business.update({
      where: { id: businessID },
      data: { isDeleted: true },
    });
  }

  async update(businessID: string, dto: UpdateBusinessAccDTO) {
    return await this.prismaService.business.update({
      where: { id: businessID },
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
      data: { isVerified: status, verifiedAt: new Date() },
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
    return this.prismaService.business.updateMany({
      data: {
        isVerified: status,
        verifiedAt: new Date(),
      },
      where: { id: { in: businessIDs } },
    });
  }

  async bulkUpdateDeletionStatus(businessIDs: Array<string>, status: boolean) {
    return this.prismaService.business.updateMany({
      data: {
        isDeleted: status,
      },
      where: { id: { in: businessIDs } },
    });
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
