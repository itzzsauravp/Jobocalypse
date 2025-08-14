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
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import type { Request as ExpRequest } from 'express';
import { FirmService } from './firm.service';
import { UpdateFirmDTO } from './dtos/update-firm.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('firm')
@Controller('firm')
export class FirmController {
  constructor(
    private readonly firmService: FirmService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getFirmProfile(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.firmService.findByID> {
    return await this.firmService.findByID(request.user.id);
  }

  @Patch()
  async updateFirm(
    @Request() request: ExpRequest,
    @Body() data: UpdateFirmDTO,
  ): ReturnType<typeof this.firmService.update> {
    const firm = await this.firmService.findByID(request.user.id);
    const updatedData: UpdateFirmDTO = Object.assign(firm, data);
    return await this.firmService.update(request.user.id, updatedData);
  }

  @Delete()
  async softDeleteFirm(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.firmService.softDelete> {
    return this.firmService.softDelete(request.user.id);
  }

  @ResponseMessage('profile picture updated successfully')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpRequest,
  ) {
    const firm = await this.firmService.findByID(request.user.id);
    const uploadedResult = await this.cloudinaryService.uploadAvatar(
      file,
      'admin',
      request.user.id,
      firm.profilePic ? true : false,
    );
    const updatedFirm = await this.firmService.update(request.user.id, {
      profilePic: uploadedResult.secure_url as string,
      publicID: uploadedResult.public_id as string,
    });
    return updatedFirm;
  }

  @ResponseMessage('avatar removed sucessfully')
  @Delete('avatar')
  async removeAvatar(@Request() request: ExpRequest) {
    const firm = await this.firmService.findByID(request.user.id);
    const result = await this.cloudinaryService.deleteImage(
      firm.publicID as string,
    );
    if (result?.data.result !== 'ok')
      throw new InternalServerErrorException('Error while removing avatar');
    return result;
  }
}
