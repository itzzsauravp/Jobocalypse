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
      const uniqueName = `${Date.now()}-${id}`;
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        { folder: `avatar/${folder}/${id}`, public_id: uniqueName, overwrite },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result as CloudinaryResponse);
        },
      );
      streamifier.createReadStream(optimizeBuffer).pipe(uploadStream);
    });
  }

  async singleFileUpload(
    file: Express.Multer.File,
    folder: Role,
    id: string,
    overwrite: boolean = false,
  ): Promise<CloudinaryResponse> {
    const optimizeBuffer = await this.optimizeBuffer(file.buffer);
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uniqueName = `${Date.now()}-${id}`;
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: `assets/${folder}/${id}`,
          public_id: uniqueName,
          overwrite,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Cloudinary upload failed'));
          resolve(result as CloudinaryResponse);
        },
      );
      streamifier.createReadStream(optimizeBuffer).pipe(uploadStream);
    });
  }

  //  Later on can do this just from the frontend to put load off of the server.
  // please set a limit on the files size.
  async documentsUpload(
    files: Array<Express.Multer.File>,
    folder: Role,
    id: string,
    overwrite: boolean = false,
  ): Promise<CloudinaryResponse[]> {
    const CloudinaryPromisesArray = files.map(async (file, index) => {
      return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uniqueName = `${Date.now()}-${id}-${index}`;
        const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
          {
            folder: `documents/${folder}/${id}`,
            public_id: uniqueName,
            overwrite,
            resource_type: 'raw',
          },
          (error, result) => {
            if (error) return reject(new Error(error.message));
            if (!result) return reject(new Error('Cloudinary upload failed'));
            resolve(result as CloudinaryResponse);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });
    return Promise.all(CloudinaryPromisesArray);
  }

  async bulkDeleteFiles(publicIDs: string[]) {
    await Promise.all(
      publicIDs.map((id) => this.cloudinaryInstance.uploader.destroy(id)),
    );
  }

  async deleteFile(publicID: string) {
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
