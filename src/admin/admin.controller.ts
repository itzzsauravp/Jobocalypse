import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/common/guards/jwt-auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';
import { FirmService } from 'src/firm/firm.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { UpdateAdminDTO } from './dtos/update-admin.dto';
import { Vacancy } from 'src/vacancy/interface/vacancy.interface';
import { VacancyService } from 'src/vacancy/vacancy.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly firmService: FirmService,
    private readonly vacancyService: VacancyService,
  ) {}

  // ========================= ADMIN ROUTES ===================================
  @Get()
  async getAdminProfile(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.findAdminByID> {
    return await this.adminService.findAdminByID(request.user.id);
  }

  @Patch()
  async updateAdmin(
    @Body() dto: UpdateAdminDTO,
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.udpateAdmin> {
    return await this.adminService.udpateAdmin(request.user.id, dto);
  }

  @Delete()
  async deleteAdmin(
    @Request() request: ExpRequest,
  ): ReturnType<typeof this.adminService.hardDeleteAdmin> {
    return await this.adminService.hardDeleteAdmin(request.user.id);
  }

  // ========================= USER ROUTES ===================================

  @ResponseMessage('verification status updated')
  @Post('user/:id/verification')
  async udpateVerifcationStatusUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.updateUserVerificationStatus> {
    return await this.userService.updateUserVerificationStatus(id, status);
  }

  @ResponseMessage('deletion status updated')
  @Delete('user/:id')
  async softDeleteUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.updateUserDeleteStatus> {
    return await this.userService.updateUserDeleteStatus(id, status);
  }

  @ResponseMessage('access revoked')
  @Post('user/:id/access-revoke')
  async revokeAccessUser(
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.revokeUserAccess> {
    return await this.userService.revokeUserAccess(id);
  }

  @Get('user/all')
  async findAllUsers(): ReturnType<typeof this.userService.findAllUsers> {
    return await this.userService.findAllUsers();
  }

  @Get('user/:id')
  async findUserByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.userService.findUserByID> {
    return await this.userService.findUserByID(id);
  }

  // ========================= FIRM ROUTES ===================================

  @ResponseMessage('verification status updated')
  @Post('firm/:id/verification')
  async updateVerificationStatusFirm(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.updateFrimVerificationStatus> {
    return await this.firmService.updateFrimVerificationStatus(id, status);
  }

  @ResponseMessage('deletion status updated')
  @Delete('firm/:id')
  async softDeleteFirm(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.updateFirmDeleteStatus> {
    return await this.firmService.updateFirmDeleteStatus(id, status);
  }

  @ResponseMessage('access revoked')
  @Post('firm/:id/access-revoke')
  async revokeAccessFirm(
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.revokeFirmAccess> {
    return await this.firmService.revokeFirmAccess(id);
  }

  @Get('firm/:id')
  findFirmByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.firmService.findFirmByID> {
    return this.firmService.findFirmByID(id);
  }

  @Get('firm/all')
  async findAllFrim(): ReturnType<typeof this.firmService.findAllFirms> {
    return await this.firmService.findAllFirms();
  }
  // ========================= VACANCY ROUTES ===================================

  @Delete('vacancy/delete')
  async deleteVacancy(@Param('id') id: string): Promise<Vacancy> {
    return await this.vacancyService.deleteVacancy(id);
  }

  @Get('vacancy/all')
  async findAllVacVacancy(): ReturnType<
    typeof this.vacancyService.findAllVacancy
  > {
    return await this.vacancyService.findAllVacancy();
  }

  @Get('vacancy/:id')
  findVacancyByID(
    @Param('id') id: string,
  ): ReturnType<typeof this.vacancyService.findVacancyByID> {
    return this.vacancyService.findVacancyByID(id);
  }
}
