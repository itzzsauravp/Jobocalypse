import { Inject, Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { Role } from 'src/common/interfaces/role.inteface';
import sharp from 'sharp';
import { CLOUDINARY } from './cloudinary.provider';

export type CloudianryRootFolder = 'documents' | 'assets';
export type CloudinarySubFolder = 'admin' | 'user' | 'business' | 'vacancy';
export type CloudinaryUploadResouce = 'image' | 'video' | 'raw' | 'auto';

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

  /**
   *
   * @param file File to be uploaded (comes from multer middlware for nestjs).
   * @param root Root folder name to save it in cloudianry like: `documents`, `assets` etc.
   * @param folder Sub folder under which the file is going to be saved, this is based on the roles like: `user`, `admin`, `business` etc.
   * @param id ID of the uploader i.e `businessID`, `adminID`, `userID` etc.
   * @returns `void`
   */
  async singleFileUpload(
    file: Express.Multer.File,
    root: CloudianryRootFolder,
    folder: CloudinarySubFolder,
    id: string,
  ): Promise<CloudinaryResponse> {
    let optimizeBuffer: Buffer;
    if (file.mimetype.includes('image')) {
      optimizeBuffer = await this.optimizeBuffer(file.buffer);
    } else {
      optimizeBuffer = file.buffer;
    }
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uniqueName = `${Date.now()}-${id}`;
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: `${root}/${folder}/${id}`,
          public_id: uniqueName,
          overwrite: false,
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

  /**
   *
   * @param files Array of files to be uploaded (comes from multer middlware for nestjs).
   * @param root Root folder name to save it in cloudianry like: `documents`, `assets` etc.
   * @param folder Sub folder under which the file is going to be saved, this is based on the roles like: `user`, `admin`, `business` etc.
   * @param id ID of the uploader i.e `businessID`, `adminID`, `userID` etc.
   * @returns `void`
   */
  async multiFileUpload(
    files: Array<Express.Multer.File>,
    root: CloudianryRootFolder,
    folder: CloudinarySubFolder,
    id: string,
    resource_type: CloudinaryUploadResouce = 'image',
  ): Promise<CloudinaryResponse[]> {
    const CloudinaryPromisesArray = files.map(async (file, index) => {
      return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uniqueName = `${Date.now()}-${id}-${index}`;
        const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
          {
            folder: `${root}/${folder}/${id}`,
            public_id: uniqueName,
            overwrite: false,
            resource_type,
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

  getSignedUrl(publicID: string) {
    return this.cloudinaryInstance.url(publicID, {
      resource_type: 'auto',
      type: 'authenticated',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 5,
    });
  }
}
