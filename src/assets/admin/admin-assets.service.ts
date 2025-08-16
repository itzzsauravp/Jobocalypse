import { Injectable } from '@nestjs/common';
import { AdminAssets } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminAssetsService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveProfilePicture(
    adminID: string,
    url: string,
    publicId: string,
  ): Promise<AdminAssets> {
    return await this.prismaService.adminAssets.create({
      data: {
        adminID,
        secureUrl: url,
        publicId,
        type: 'PROFILE_PIC',
      },
    });
  }
}
