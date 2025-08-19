import { Test, TestingModule } from '@nestjs/testing';
import { CLOUDINARY, CloudinaryProvider } from './cloudinary.provider';
import { v2 as cloudinary } from 'cloudinary';

describe('Cloudianry Provider', () => {
  let cloudinaryInstance: typeof cloudinary;
  let configSpy: typeof cloudinary.config;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryProvider],
    }).compile();

    cloudinaryInstance = module.get(CLOUDINARY);
    configSpy = jest.spyOn(cloudinaryInstance, 'config');
  });

  it('should be defined', () => {
    expect(cloudinaryInstance).toBeDefined();
  });

  it('should be the cloudinary v2 instance', () => {
    expect(cloudinaryInstance).toHaveProperty('uploader');
  });

  it('should have correct configuration', () => {
    expect(configSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      }),
    );
  });
});
