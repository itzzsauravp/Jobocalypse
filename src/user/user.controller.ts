import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/common/guards/jwt-auth.guard';
import type { Request as ExpRequest } from 'express';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDTO } from './dtos/update-user.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserProfile(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.userService.findUserByID> {
    return await this.userService.findUserByID(request.user.id);
  }

  @Patch()
  async updateUser(
    @Request() request: ExpRequest,
    @Body('data') data: UpdateUserDTO,
  ): ReturnType<typeof this.userService.updateUser> {
    const user = await this.userService.findUserByID(request.user.id);
    const updatedData: UpdateUserDTO = Object.assign(user, data);
    return await this.userService.updateUser(request.user.id, updatedData);
  }

  @Delete()
  async softDeleteUser(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.userService.softDeleteUser> {
    return this.userService.softDeleteUser(request.user.id);
  }
}
