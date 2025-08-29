import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Request as ExpRequest } from 'express';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';
import { UserAssetsService } from 'src/assets/user/user-assets.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userAssetsService: UserAssetsService,
  ) {}

  @Get()
  async getUserProfile(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.userService.findByID> {
    return await this.userService.findByID(request.entity.id);
  }

  @Patch()
  async updateUser(
    @Request() request: ExpRequest,
    @Body() data: UpdateUserDTO,
  ): ReturnType<typeof this.userService.update> {
    const user = await this.userService.findByIDNoAssets(request.entity.id);
    const updatedData: UpdateUserDTO = Object.assign(user, data);
    return await this.userService.update(request.entity.id, updatedData);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.userService.findByUsername(username);
  }

  @Delete()
  async deleteUser(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.userService.delete> {
    return this.userService.delete(request.entity.id);
  }

  @ResponseMessage('profile picture updated successfully')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpRequest,
  ) {
    return await this.userAssetsService.saveProfilePicture(
      request.entity.id,
      file,
    );
  }

  @ResponseMessage('CV uploaded successfully')
  @Post('cv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(
    @Request() request: ExpRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userAssetsService.uploadUserCV(request.entity.id, file);
  }
}
