import { Body, Controller, Get } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('url')
  generateSignedUrl(@Body('id') id: string) {
    return this.cloudinaryService.getSignedUrl(id);
  }
}
