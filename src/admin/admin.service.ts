import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Admin } from './interface/admin-interface';
import { hash } from 'bcryptjs';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllAdmins(): Promise<Array<Admin>> {
    const admins = await this.prismaService.admin.findMany();
    return admins;
  }

  async findAdminByID(id: string): Promise<Admin> {
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id,
      },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    const admin = await this.prismaService.admin.findUnique({
      where: {
        email,
      },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async findAdminExists(email: string): Promise<boolean> {
    const admin = await this.prismaService.admin.findUnique({
      where: {
        email,
      },
    });
    return admin ? true : false;
  }

  async createAdmin(dto: CreateEntityDTO): Promise<Admin> {
    const hashedPassword = await hash(dto.password, 10);
    const admin = await this.prismaService.admin.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
      },
    });
    return admin;
  }

  async hardDeleteAdmin(id: string): Promise<Admin> {
    const admin = await this.prismaService.admin.delete({
      where: {
        id,
      },
    });
    return admin;
  }

  async udpateAdmin(id: string, data: Partial<Admin>) {
    const admin = await this.prismaService.admin.update({
      where: {
        id,
      },
      data,
    });
    return admin;
  }
}
