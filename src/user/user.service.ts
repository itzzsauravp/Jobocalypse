import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './interface/user-interface';
import { CreateEntityDTO } from 'src/common/dtos/create-entity.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllUsers(): Promise<Array<Omit<User, 'type'>>> {
    const users = await this.prismaService.user.findMany();
    return users;
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
