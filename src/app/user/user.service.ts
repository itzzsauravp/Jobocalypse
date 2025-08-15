import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from 'src/app/user/dtos/create-user.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';
import { User } from 'generated/prisma';
import { GenericOAuthEntity } from '../auth/common/interface/auth.interface';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(dto: PaginationDTO): Promise<PaginatedData<Array<User>>> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const users = await this.prismaService.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    const totalCount = await this.prismaService.user.count();
    return {
      data: users,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findByID(id: string): Promise<Omit<User, 'type'>> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
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

  async create(dto: CreateUserDTO): Promise<Omit<User, 'type'>> {
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

  async assertCreate(dto: GenericOAuthEntity) {
    return await this.prismaService.user.upsert({
      where: { email: dto.email },
      update: {},
      create: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        profilePic: dto.profilePic,
        provider: dto.provider,
        providerID: dto.providerID,
      },
    });
  }

  async softDelete(id: string): Promise<Omit<User, 'type'>> {
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

  async bulkSoftDelete(ids: Array<string>, status: boolean): Promise<string> {
    const result = await this.prismaService.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isDeleted: true,
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

  async update(id: string, data: Partial<User>): Promise<Omit<User, 'type'>> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
    return user;
  }

  async updateDeleteStatus(
    id: string,
    status: boolean,
  ): Promise<Omit<User, 'type'>> {
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

  async updateVerificationStatus(
    id: string,
    status: boolean,
  ): Promise<Omit<User, 'type'>> {
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

  async revokeAccess(id: string): Promise<Omit<User, 'type'>> {
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
