import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { ASSETS_TYPE } from 'generated/prisma';

@Injectable()
export class VacancyAssetsService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveVacancyAssets(
    vacancyID: string,
    cloudinaryResult: UploadApiResponse[],
  ) {
    const vacancyData = cloudinaryResult.map((cr) => ({
      secureUrl: cr.secure_url,
      publicId: cr.public_id,
      type: ASSETS_TYPE.IMAGE,
      format: cr.format,
      vacancyID,
    }));
    return await this.prismaService.vacancyAssets.createMany({
      data: vacancyData,
    });
  }
}
