import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { ASSETS_TYPE } from 'generated/prisma';
import { STATUS } from 'generated/prisma';

@Injectable()
export class BusinessAssetsService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveDocumentsInBulk(
    businessID: string,
    cloudinaryResult: UploadApiResponse[],
  ): Promise<{ count: number }> {
    const documentsList = cloudinaryResult.map((cr) => ({
      format: cr.format,
      publicId: cr.public_id,
      secureUrl: cr.secure_url,
      status: STATUS.PENDING,
      type: ASSETS_TYPE.DOCUMENT,
      businessID,
    }));
    return await this.prismaService.businessAssets.createMany({
      data: documentsList,
    });
  }
}
