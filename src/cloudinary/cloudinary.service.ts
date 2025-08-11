import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { Role } from 'src/common/interfaces/role.inteface';

@Injectable()
export class CloudinaryService {
  async uploadAvatar(
    file: Express.Multer.File,
    folder: Role,
    id: string,
    overwrite: boolean = false,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uniqueName = `${folder}-${id}`;
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, public_id: uniqueName, overwrite },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result as CloudinaryResponse);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicID: string) {
    try {
      const result = (await cloudinary.uploader.destroy(publicID)) as {
        data: { result: string };
      };
      return result;
    } catch (error) {
      console.log('Failed to delete image.', error);
    }
  }
}
