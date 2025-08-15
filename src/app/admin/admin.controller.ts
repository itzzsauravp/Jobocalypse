import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request as ExpRequest } from 'express';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserService } from 'src/app/user/user.service';
import { AdminService } from './admin.service';
import { UpdateAdminDTO } from './dtos/update-admin.dto';
import { Vacancy } from 'src/app/vacancy/interface/vacancy.interface';
import { VacancyService } from 'src/app/vacancy/vacancy.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly vacancyService: VacancyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ========================= ADMIN ROUTES ===================================
  @Get()
  async getAdminProfile(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.findByID> {
    return await this.adminService.findByID(request.entity.id);
  }

  @ResponseMessage('admin updated successfully')
  @Patch()
  async updateAdmin(
    @Body() dto: UpdateAdminDTO,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.update> {
    return await this.adminService.update(request.entity.id, dto);
  }

  @ResponseMessage('admin delete successfully')
  @Delete()
  async deleteAdmin(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.delete> {
    return await this.adminService.delete(request.entity.id);
  }

  @ResponseMessage('profile picture updated successfully')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpRequest,
  ) {
    const admin = await this.adminService.findByID(request.entity.id);
    const uploadedResult = await this.cloudinaryService.uploadAvatar(
      file,
      'admin',
      request.entity.id,
      admin.profilePic ? true : false,
    );
    const updatedAdmin = await this.adminService.update(request.entity.id, {
      profilePic: uploadedResult.secure_url as string,
      publicID: uploadedResult.public_id as string,
    });
    return updatedAdmin;
  }

  @ResponseMessage('avatar removed sucessfully')
  @Delete('avatar')
  async removeAvatar(@Request() request: ExpRequest) {
    const admin = await this.adminService.findByID(request.entity.id);
    const result = await this.cloudinaryService.deleteImage(
      admin.publicID as string,
    );
    if (result?.data.result !== 'ok')
      throw new InternalServerErrorException('Error while removing avatar');
    return result;
  }

  // ========================= USER ROUTES ===================================

  @Delete('user/delete')
  async bulkDeleteUsers(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.userService.bulkSoftDelete> {
    return this.userService.bulkSoftDelete(ids, status);
  }

  @Post('user/verification')
  async bulkUpdateUserVerificationStatus(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.userService.bulkUpdateVerficationStatus> {
    return this.userService.bulkUpdateVerficationStatus(ids, status);
  }

  @ResponseMessage('verification status updated')
  @Post('user/:id/verification')
  async udpateVerifcationStatusUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.updateVerificationStatus> {
    return await this.userService.updateVerificationStatus(id, status);
  }

  @ResponseMessage('deletion status updated')
  @Delete('user/:id')
  async softDeleteUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.updateDeleteStatus> {
    return await this.userService.updateDeleteStatus(id, status);
  }

  @ResponseMessage('access revoked')
  @Post('user/:id/access-revoke')
  async revokeAccessUser(
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.revokeAccess> {
    return await this.userService.revokeAccess(id);
  }

  @Get('user/all')
  async findAllUsers(
    @Query() dto: PaginationDTO,
  ): ReturnType<typeof this.userService.findAll> {
    return await this.userService.findAll(dto);
  }

  @Get('user/:id')
  async findUserByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.findByID> {
    return await this.userService.findByID(id);
  }

  // ========================= VACANCY ROUTES ===================================

  @Delete('vacancy/:id')
  async deleteVacancy(@Param('id') id: string): Promise<Vacancy> {
    return await this.vacancyService.deleteVacancyAdmin(id);
  }

  @Get('vacancy/all')
  async findAllVacVacancy(
    @Query() dto: PaginationDTO,
  ): ReturnType<typeof this.vacancyService.findAllVacancy> {
    return await this.vacancyService.findAllVacancy(dto);
  }

  @Get('vacancy/:id')
  findVacancyByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.vacancyService.findVacancyByID> {
    return this.vacancyService.findVacancyByID(id);
  }
}
