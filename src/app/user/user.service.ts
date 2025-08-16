import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from 'src/app/user/dtos/create-user.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';
import { User } from 'generated/prisma';
import { GenericOAuthEntity } from '../auth/common/interface/auth.interface';
import { UserAssetsService } from 'src/assets/user/user-assets.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userAssetsService: UserAssetsService,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(dto: PaginationDTO): Promise<PaginatedData<Array<User>>> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    let cachedUser = await this.cacheService.get<Array<User>>(
      'admin:paginated-user',
    );
    if (!cachedUser) {
      const users = await this.prismaService.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assets: {
            where: { type: 'PROFILE_PIC' },
            orderBy: { uploadedAt: 'desc' },
            take: 1,
          },
        },
      });
      await this.cacheService.set('admin:paginated-user', users);
      cachedUser = users;
    }
    const totalCount = await this.prismaService.user.count();
    return {
      data: cachedUser,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findByIDNoAssets(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByID(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        assets: {
          where: { type: 'PROFILE_PIC' },
          orderBy: { uploadedAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        assets: {
          where: { type: 'PROFILE_PIC' },
          orderBy: { uploadedAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!user) return null;
    return user;
  }

  async findExists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user ? true : false;
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const hashedPassword = await hash(dto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        address: dto.address,
        phoneNumber: dto.phoneNumber,
      },
    });
    return user;
  }

  async upsertCreate(dto: GenericOAuthEntity) {
    const user = await this.prismaService.user.upsert({
      where: { email: dto.email },
      update: {},
      create: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        provider: dto.provider,
        providerID: dto.providerID,
      },
    });

    if (dto.profilePic) {
      await this.userAssetsService.saveProfilePictureOAuth(
        user.id,
        dto.profilePic,
      );
    }

    return user;
  }

  async delete(id: string): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    return user;
  }

  async bulkUpdateDeletionStatus(
    ids: Array<string>,
    status: boolean,
  ): Promise<string> {
    const result = await this.prismaService.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isDeleted: status,
      },
    });
    return `${result.count} users deletion status set to ${status}`;
  }

  async bulkUpdateVerficationStatus(
    ids: Array<string>,
    status: boolean,
  ): Promise<string> {
    const result = await this.prismaService.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isVerified: status,
      },
    });
    return `${result.count} users verification set to ${status}`;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
    return user;
  }

  async updateDeleteStatus(id: string, status: boolean): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: status,
      },
    });
    return user;
  }

  async updateVerificationStatus(id: string, status: boolean): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        isVerified: status,
      },
    });
    return user;
  }

  async revokeAccess(id: string): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        refreshToken: null,
      },
    });
    return user;
  }
}
