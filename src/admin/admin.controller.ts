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

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly frimService: FirmService,
  ) {}

  // ========================= ADMIN ROUTES ===================================
  @Get()
  async getAdminProfile(@Request() request: ExpRequest) {
    return await this.adminService.findAdminByID(request.user.id);
  }

  @Patch('update')
  async updateAdmin(
    @Body() dto: UpdateAdminDTO,
    @Request() request: ExpRequest,
  ) {
    return await this.adminService.udpateAdmin(request.user.id, dto);
  }

  @Delete('delete')
  async deleteAdmin(@Request() request: ExpRequest) {
    return await this.adminService.hardDeleteAdmin(request.user.id);
  }

  // ========================= USER ROUTES ===================================

  @ResponseMessage('verification status updated')
  @Post('user/:id/verification')
  async udpateVerifcationStatusUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ) {
    return await this.userService.updateUserVerificationStatus(id, status);
  }

  @ResponseMessage('deletion status updated')
  @Post('user/:id/delete')
  async softDeleteUser(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ) {
    return await this.userService.updateUserDeleteStatus(id, status);
  }

  @ResponseMessage('access revoked')
  @Post('user/:id/access-revoke')
  async revokeAccessUser(@Param('id') id: string) {
    return await this.userService.revokeUserAccess(id);
  }

  @Get('user/all')
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get('user/:id')
  findUserByID(@Param('id') id: string) {
    return this.userService.findUserByID(id);
  }

  // ========================= FIRM ROUTES ===================================

  @ResponseMessage('verification status updated')
  @Post('firm/:id/verification')
  async updateVerificationStatusFirm(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ) {
    return await this.frimService.updateFrimVerificationStatus(id, status);
  }

  @ResponseMessage('deletion status updated')
  @Post('firm/:id/delete')
  async softDeleteFirm(
    @Body('status') status: boolean,
    @Param('id') id: string,
  ) {
    return await this.frimService.updateFirmDeleteStatus(id, status);
  }

  @ResponseMessage('access revoked')
  @Post('firm/:id/access-revoke')
  async revokeAccessFirm(@Param('id') id: string) {
    return await this.frimService.revokeFirmAccess(id);
  }

  @Get('firm/all')
  findAllFrim() {
    return this.frimService.findAllFirms();
  }

  @Get('firm/:id')
  findFirmByID(@Param('id') id: string) {
    return this.frimService.findFirmByID(id);
  }
}
