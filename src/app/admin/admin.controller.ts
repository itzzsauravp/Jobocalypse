import {
  Body,
  Controller,
  Delete,
  Get,
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
import { VacancyService } from 'src/app/vacancy/vacancy.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';
import { STATUS, Vacancy } from 'generated/prisma';
import { BusinessService } from '../business/business.service';
import { AdminAssetsService } from 'src/assets/admin/admin-assets.service';
import { UploadApiResponse } from 'cloudinary';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly vacancyService: VacancyService,
    private readonly businessService: BusinessService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly adminAssetsService: AdminAssetsService,
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
    const uploadedResult = (await this.cloudinaryService.uploadAvatar(
      file,
      'admin',
      request.entity.id,
    )) as UploadApiResponse;
    await this.adminAssetsService.saveProfilePicture(
      request.entity.id,
      uploadedResult.secure_url,
      uploadedResult.public_id,
    );
  }

  // ========================= USER ROUTES ===================================

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

  @ResponseMessage('verification status updated')
  @Patch('user/:id/verification')
  async udpateVerifcationStatusUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.updateVerificationStatus> {
    return await this.userService.updateVerificationStatus(id, status);
  }

  @ResponseMessage('access revoked')
  @Patch('user/:id/access-revoke')
  async revokeAccessUser(
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.revokeAccess> {
    return await this.userService.revokeAccess(id);
  }

  @ResponseMessage('deletion status updated')
  @Delete('user/:id/delete')
  async softDeleteUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.updateDeleteStatus> {
    return await this.userService.updateDeleteStatus(id, status);
  }

  @Delete('user/delete')
  async bulkDeleteUsers(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.userService.bulkUpdateDeletionStatus> {
    return this.userService.bulkUpdateDeletionStatus(ids, status);
  }

  @Patch('user/verification')
  async bulkUpdateUserVerificationStatus(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.userService.bulkUpdateVerficationStatus> {
    return this.userService.bulkUpdateVerficationStatus(ids, status);
  }

  // ========================= VACANCY ROUTES ===================================

  @Get('vacancy/all')
  async findAllVacVacancy(
    @Query() dto: PaginationDTO,
  ): ReturnType<typeof this.vacancyService.findAll> {
    return await this.vacancyService.findAll(dto);
  }

  @Get('vacancy/:id')
  findVacancyByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.vacancyService.findByID> {
    return this.vacancyService.findByID(id);
  }

  @Delete('vacancy/:id')
  async deleteVacancy(@Param('id') id: string): Promise<Vacancy> {
    return await this.vacancyService.deleteVacancyAdmin(id);
  }

  // ========================= BUSINESS ROUTES ===================================

  @Get('business/all')
  async findAllBusiness(
    @Query() dto: PaginationDTO,
  ): ReturnType<typeof this.businessService.findAll> {
    return await this.businessService.findAll(dto);
  }

  @Get('business/:id')
  async findBusinessByID(
    @Param() id: string,
  ): ReturnType<typeof this.businessService.findByID> {
    return await this.businessService.findByID(id);
  }

  @Patch('business/:id/status')
  async updateBusinessStatus(
    @Param() id: string,
    @Body('status') status: STATUS,
  ): ReturnType<typeof this.businessService.updateStatus> {
    return await this.businessService.updateStatus(id, status);
  }

  @Patch('business/:id/verification')
  async updateBusinessVerificationStatus(
    @Param() id: string,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.businessService.updateVerificationStatus> {
    return await this.businessService.updateVerificationStatus(id, status);
  }

  @Delete('business/:id/deletion')
  async updateBusinessDeletionStatus(
    @Param() id: string,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.businessService.updateDeletionStatus> {
    return await this.businessService.updateDeletionStatus(id, status);
  }

  @Patch('business/status')
  async bulkUpdateBusinessStatus(
    @Body('ids') ids: Array<string>,
    @Body('status') status: STATUS,
  ): ReturnType<typeof this.businessService.bulkUpdateStatus> {
    return await this.businessService.bulkUpdateStatus(ids, status);
  }

  @Patch('business/verification')
  async bulkUpdateBusinessVerificationStatus(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.businessService.bulkUpdateVerificationStatus> {
    return await this.businessService.bulkUpdateVerificationStatus(ids, status);
  }

  @Delete('business/deletion')
  async bulkUpdateBusinessDeletionStatus(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.businessService.bulkUpdateDeletionStatus> {
    return await this.businessService.bulkUpdateDeletionStatus(ids, status);
  }
}
