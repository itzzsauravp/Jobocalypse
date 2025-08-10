import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Firm } from './interface/firm-interface';
import { CreateFirmDTO } from './dtos/create-firm.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class FirmService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllFirms(): Promise<Array<Firm>> {
    const frims = await this.prismaService.firm.findMany();
    return frims;
  }

  async findFirmByID(id: string): Promise<Firm> {
    const firm = await this.prismaService.firm.findUnique({
      where: {
        id,
      },
    });
    if (!firm) throw new NotFoundException('Firm not found');
    return firm;
  }

  async findFirmByEmail(email: string): Promise<Firm> {
    const firm = await this.prismaService.firm.findUnique({
      where: {
        email,
      },
    });
    if (!firm) throw new NotFoundException('Firm not found');
    return firm;
  }

  async findFirmExits(email: string): Promise<boolean> {
    const firm = await this.prismaService.firm.findUnique({
      where: {
        email,
      },
    });
    return firm ? true : false;
  }

  async createFrim(dto: CreateFirmDTO): Promise<Firm> {
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

  async softDeleteFrim(id: string): Promise<Firm> {
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

  async udpateFirm(id: string, data: Partial<Firm>) {
    const firm = await this.prismaService.firm.update({
      where: {
        id,
      },
      data,
    });
    return firm;
  }

  async updateFirmDeleteStatus(
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

  async updateFrimVerificationStatus(
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

  async revokeFirmAccess(id: string): Promise<Omit<Firm, 'type'>> {
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
