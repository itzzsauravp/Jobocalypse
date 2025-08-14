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
import { JwtAuthGuard } from 'src/app/auth/guards/jwt-auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { FirmService } from 'src/app/firm/firm.service';
import { UserService } from 'src/app/user/user.service';
import { AdminService } from './admin.service';
import { UpdateAdminDTO } from './dtos/update-admin.dto';
import { Vacancy } from 'src/app/vacancy/interface/vacancy.interface';
import { VacancyService } from 'src/app/vacancy/vacancy.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly firmService: FirmService,
    private readonly vacancyService: VacancyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ========================= ADMIN ROUTES ===================================
  @Get()
  async getAdminProfile(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.findByID> {
    return await this.adminService.findByID(request.user.id);
  }

  @ResponseMessage('admin updated successfully')
  @Patch()
  async updateAdmin(
    @Body() dto: UpdateAdminDTO,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.update> {
    return await this.adminService.update(request.user.id, dto);
  }

  @ResponseMessage('admin delete successfully')
  @Delete()
  async deleteAdmin(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.hardDelete> {
    return await this.adminService.hardDelete(request.user.id);
  }

  @ResponseMessage('profile picture updated successfully')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: ExpRequest,
  ) {
    const admin = await this.adminService.findByID(request.user.id);
    const uploadedResult = await this.cloudinaryService.uploadAvatar(
      file,
      'admin',
      request.user.id,
      admin.profilePic ? true : false,
    );
    const updatedAdmin = await this.adminService.update(request.user.id, {
      profilePic: uploadedResult.secure_url as string,
      publicID: uploadedResult.public_id as string,
    });
    return updatedAdmin;
  }

  @ResponseMessage('avatar removed sucessfully')
  @Delete('avatar')
  async removeAvatar(@Request() request: ExpRequest) {
    const admin = await this.adminService.findByID(request.user.id);
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

  // ========================= FIRM ROUTES ===================================

  @Delete('firm/delete')
  async bulkDeleteFirms(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.firmService.bulkSoftDelete> {
    return this.firmService.bulkSoftDelete(ids, status);
  }

  @Post('firm/verification')
  async bulkUpdateFirmVerificationStatus(
    @Body('ids') ids: Array<string>,
    @Body('status') status: boolean,
  ): ReturnType<typeof this.firmService.bulkUpdateVerficationStatus> {
    return this.firmService.bulkUpdateVerficationStatus(ids, status);
  }

  @ResponseMessage('verification status updated')
  @Post('firm/:id/verification')
  async updateVerificationStatusFirm(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.updateVerificationStatus> {
    return await this.firmService.updateVerificationStatus(id, status);
  }

  @ResponseMessage('deletion status updated')
  @Delete('firm/:id')
  async softDeleteFirm(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.updateDeleteStatus> {
    return await this.firmService.updateDeleteStatus(id, status);
  }

  @ResponseMessage('access revoked')
  @Post('firm/:id/access-revoke')
  async revokeAccessFirm(
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.revokeAccess> {
    return await this.firmService.revokeAccess(id);
  }

  @Get('firm/:id')
  findFirmByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.findByID> {
    return this.firmService.findByID(id);
  }

  @Get('firm/all')
  async findAllFrim(
    @Query() dto: PaginationDTO,
  ): ReturnType<typeof this.firmService.findAll> {
    return await this.firmService.findAll(dto);
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
