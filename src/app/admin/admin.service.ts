import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';
import { Admin } from 'generated/prisma';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(dto: PaginationDTO): Promise<PaginatedData<Array<Admin>>> {
    const { limit, page } = dto;
    const skip = (page - 1) * limit;
    const admins = await this.prismaService.admin.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    const totalCount = await this.prismaService.admin.count();
    return {
      data: admins,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findByID(id: string): Promise<Admin> {
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id,
      },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prismaService.admin.findUnique({
      where: {
        email,
      },
    });
    if (!admin) return null;
    return admin;
  }

  async create(dto: CreateEntityDTO): Promise<Admin> {
    const hashedPassword = await hash(dto.password, 10);
    const admin = await this.prismaService.admin.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        address: dto.address ?? null,
        phoneNumber: dto.phoneNumber ?? null,
        password: hashedPassword,
      },
    });
    return admin;
  }

  async delete(id: string): Promise<Admin> {
    const admin = await this.prismaService.admin.delete({
      where: {
        id,
      },
    });
    return admin;
  }

  async update(id: string, data: Partial<Admin>) {
    const admin = await this.prismaService.admin.update({
      where: {
        id,
      },
      data,
    });
    return admin;
  }
}
