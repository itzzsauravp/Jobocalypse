import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { ASSETS_TYPE, Prisma } from 'generated/prisma';
import { STATUS } from 'generated/prisma';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BusinessAssetsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async saveDocumentsInBulk(
    tsx: Prisma.TransactionClient,
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
    return await tsx.businessAssets.createMany({
      data: documentsList,
    });
  }

  async deleteBusinessAsset(id: string) {
    try {
      const deleteAsset = await this.prismaService.businessAssets.delete({
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
