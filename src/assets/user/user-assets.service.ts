import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { User, UserAssets } from 'generated/prisma';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserAssetsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async saveProfilePicture(
    userID: string,
    file: Express.Multer.File,
  ): Promise<UserAssets> {
    const uploadedResult = (await this.cloudinaryService.uploadAvatar(
      file,
      'user',
      userID,
    )) as UploadApiResponse;

    return await this.prismaService.userAssets.create({
      data: {
        userID,
        secureUrl: uploadedResult.secure_url,
        publicId: uploadedResult.public_id,
        type: 'PROFILE_PIC',
      },
    });
  }

  async saveProfilePictureOAuth(
    userID: string,
    url: string,
  ): Promise<UserAssets> {
    return await this.prismaService.userAssets.create({
      data: {
        userID,
        secureUrl: url,
        type: 'PROFILE_PIC',
      },
    });
  }

  async getUserAssets(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: {
        assets: {
          some: {},
        },
        isDeleted: false,
      },
      include: {
        assets: true,
      },
    });
  }

  async uploadUserCV(
    userID: string,
    file: Express.Multer.File,
  ): Promise<UserAssets> {
    const uploadResult = (await this.cloudinaryService.singleFileUpload(
      file,
      'documents',
      'user',
      userID,
    )) as UploadApiResponse;
    return await this.prismaService.userAssets.create({
      data: {
        userID,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        type: 'DOCUMENT',
      },
    });
  }
}
