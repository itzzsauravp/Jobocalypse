import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Firm } from './interface/firm.interface';
import { CreateFirmDTO } from './dtos/create-firm.dto';
import { hash } from 'bcryptjs';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';

@Injectable()
export class FirmService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(dto: PaginationDTO): Promise<PaginatedData<Array<Firm>>> {
    const { limit, page } = dto;
    const skip = (page - 1) * limit;
    const firms = await this.prismaService.firm.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    const totalCount = await this.prismaService.firm.count();
    return {
      data: firms,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findByID(id: string): Promise<Firm> {
    const firm = await this.prismaService.firm.findUnique({
      where: {
        id,
      },
    });
    if (!firm) throw new NotFoundException('Firm not found');
    return firm;
  }

  async findByEmail(email: string): Promise<Firm> {
    const firm = await this.prismaService.firm.findUnique({
      where: {
        email,
      },
    });
    if (!firm) throw new NotFoundException('Firm not found');
    return firm;
  }

  async findExists(email: string): Promise<boolean> {
    const firm = await this.prismaService.firm.findUnique({
      where: {
        email,
      },
    });
    return firm ? true : false;
  }

  async create(dto: CreateFirmDTO): Promise<Firm> {
    const hashedPassword = await hash(dto.password, 10);
    const firm = await this.prismaService.firm.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        establishedOn: dto.establishedOn,
        location: dto.location,
        phoneNumber: dto.phoneNumber,
        type: dto.type,
      },
    });
    return firm;
  }

  async softDelete(id: string): Promise<Firm> {
    const firm = await this.prismaService.firm.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    return firm;
  }

  async bulkSoftDelete(ids: Array<string>, status: boolean): Promise<string> {
    const result = await this.prismaService.firm.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isDeleted: true,
      },
    });
    return `${result.count} firms deletion status set to ${status}`;
  }

  async bulkUpdateVerficationStatus(
    ids: Array<string>,
    status: boolean,
  ): Promise<string> {
    const result = await this.prismaService.firm.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isVerified: status,
      },
    });
    return `${result.count} firms verification set to ${status}`;
  }

  async update(id: string, data: Partial<Firm>) {
    const firm = await this.prismaService.firm.update({
      where: {
        id,
      },
      data,
    });
    return firm;
  }

  async updateDeleteStatus(
    id: string,
    status: boolean,
  ): Promise<Omit<Firm, 'type'>> {
    const firm = await this.prismaService.firm.update({
      where: {
        id,
      },
      data: {
        isDeleted: status,
      },
    });
    return firm;
  }

  async updateVerificationStatus(
    id: string,
    status: boolean,
  ): Promise<Omit<Firm, 'type'>> {
    const firm = await this.prismaService.firm.update({
      where: {
        id,
      },
      data: {
        isVerified: status,
      },
    });
    return firm;
  }

  async revokeAccess(id: string): Promise<Omit<Firm, 'type'>> {
    const firm = await this.prismaService.firm.update({
      where: {
        id,
      },
      data: {
        refreshToken: null,
      },
    });
    return firm;
  }
}
