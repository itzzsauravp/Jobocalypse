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
import { DocumentService } from '../document/document.service';

@Injectable()
export class BusinessService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clodinaryService: CloudinaryService,
    private readonly documentService: DocumentService,
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
    const cloudinaryResult = await this.clodinaryService.documentsUpload(
      files,
      'user',
      id,
      false,
    );
    try {
      const result = await this.prismaService.$transaction(async () => {
        const businessAccountToBeVerified =
          await this.prismaService.business.create({
            data: {
              owner: { connect: { id } },
              address: dto.address,
              description: dto.description,
              name: dto.name,
              phoneNumber: dto.phoneNumber,
              website: dto.website,
            },
          });
        await this.documentService.createMultipleDocsBusiness(
          businessAccountToBeVerified.id,
          cloudinaryResult.map((item) => ({
            format: (item.format as string) || 'unknown',
            publicID: item.public_id as string,
            secureURL: item.secure_url as string,
            type: item.type as string,
          })),
        );
        return businessAccountToBeVerified;
      });
      return {
        account: result,
        message: 'verification pending from admin',
      };
    } catch {
      await this.clodinaryService.bulkDeleteFiles(
        cloudinaryResult.map((item) => item.public_id as string),
      );
      throw new InternalServerErrorException(
        'Something went wrong! Try again later',
      );
    }
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
      data: { isVerified: status },
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
}
