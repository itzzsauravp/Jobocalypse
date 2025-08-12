import { Inject, Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { Role } from 'src/common/interfaces/role.inteface';
import sharp from 'sharp';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async optimizeBuffer(buffer: Buffer) {
    return await sharp(buffer).resize(800).webp({ quality: 80 }).toBuffer();
  }

  async uploadAvatar(
    file: Express.Multer.File,
    folder: Role,
    id: string,
    overwrite: boolean = false,
  ): Promise<CloudinaryResponse> {
    const optimizeBuffer = await this.optimizeBuffer(file.buffer);
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uniqueName = `${folder}-${id}`;
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        { folder, public_id: uniqueName, overwrite },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result as CloudinaryResponse);
        },
      );
      streamifier.createReadStream(optimizeBuffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicID: string) {
    try {
      const result = (await this.cloudinaryInstance.uploader.destroy(
        publicID,
      )) as {
        data: { result: string };
      };
      return result;
    } catch (error) {
      console.log('Failed to delete image.', error);
    }
  }
}
