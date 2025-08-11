import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
