import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User } from 'src/auth/auth.inteface';
import { SignInDTO } from 'src/auth/dto/sign-in.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllUsers(): Promise<Array<User>> {
    const users = this.prismaService.user.findMany();
    return users;
  }

  async findUserByID(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
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

  async createUser(dto: SignInDTO): Promise<User> {
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

  async softDeleteUser(id: string) {
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

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
    return user;
  }
}
