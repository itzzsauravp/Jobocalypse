import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './interface/user.interface';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllUsers(
    dto: PaginationDTO,
  ): Promise<PaginatedData<Array<Omit<User, 'type'>>>> {
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

  async findUserByID(id: string): Promise<Omit<User, 'type'>> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserByEmail(email: string): Promise<Omit<User, 'type'>> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserExists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user ? true : false;
  }

  async createUser(dto: CreateEntityDTO): Promise<Omit<User, 'type'>> {
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

  async softDeleteUser(id: string): Promise<Omit<User, 'type'>> {
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

  async bulkSoftDeleteUser(
    ids: Array<string>,
    status: boolean,
  ): Promise<string> {
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

  async bulkUpdateUserVerficationStatus(
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

  async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<Omit<User, 'type'>> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
    return user;
  }

  async updateUserDeleteStatus(
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

  async updateUserVerificationStatus(
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

  async revokeUserAccess(id: string): Promise<Omit<User, 'type'>> {
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
