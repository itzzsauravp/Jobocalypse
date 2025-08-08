import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/common/guards/jwt-auth.guard';
import type { Request as ExpRequest } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findUserByID(@Param('id') id: string) {
    return this.userService.findUserByID(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  softDeleteUser(@Request() request: ExpRequest) {
    return this.userService.softDeleteUser(request.user.id);
  }
}
