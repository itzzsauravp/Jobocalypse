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
  async getUserProfile(@Request() request: ExpRequest) {
    return await this.userService.findUserByID(request.user.id);
  }

  @Patch('update')
  async updateUser(
    @Request() request: ExpRequest,
    @Body('data') data: UpdateUserDTO,
  ) {
    const user = await this.userService.findUserByID(request.user.id);
    const updatedData: UpdateUserDTO = Object.assign(user, data);
    return await this.userService.updateUser(request.user.id, updatedData);
  }

  @Delete('delete')
  async softDeleteUser(@Request() request: ExpRequest) {
    return this.userService.softDeleteUser(request.user.id);
  }
}
