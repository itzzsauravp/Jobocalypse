import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
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
    const user = await this.userService.findByID(request.entity.id);
    const updatedData: UpdateUserDTO = Object.assign(user, data);
    return await this.userService.update(request.entity.id, updatedData);
  }

  @Delete()
  async softDeleteUser(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.userService.softDelete> {
    return this.userService.softDelete(request.entity.id);
  }

  @ResponseMessage('profile picture updated successfully')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpRequest,
  ) {
    const user = await this.userService.findByID(request.entity.id);
    const uploadedResult = await this.cloudinaryService.uploadAvatar(
      file,
      'user',
      request.entity.id,
      user.profilePic ? true : false,
    );
    const updatedUser = await this.userService.update(request.entity.id, {
      profilePic: uploadedResult.secure_url as string,
      publicID: uploadedResult.public_id as string,
    });
    return updatedUser;
  }

  @ResponseMessage('avatar removed sucessfully')
  @Delete('avatar')
  async removeAvatar(@Request() request: ExpRequest) {
    const user = await this.userService.findByID(request.entity.id);
    const result = await this.cloudinaryService.deleteImage(
      user.publicID as string,
    );
    if (result?.data.result !== 'ok')
      throw new InternalServerErrorException('Error while removing avatar');
    return result;
  }
}
