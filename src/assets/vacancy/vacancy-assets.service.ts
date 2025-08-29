import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { ASSETS_TYPE } from 'generated/prisma';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class VacancyAssetsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
  async deleteVacancyAsset(id: string) {
    try {
      const deleteAsset = await this.prismaService.vacancyAssets.delete({
        where: {
          id,
        },
      });
      if (deleteAsset) {
        await this.cloudinaryService.deleteFile(deleteAsset.publicId);
        return deleteAsset;
      } else {
        throw new InternalServerErrorException('Something went wrong!');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
