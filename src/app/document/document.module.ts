import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
