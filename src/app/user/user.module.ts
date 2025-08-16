import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserAssetsModule } from 'src/assets/user/user-assets.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, UserAssetsModule, CacheModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
