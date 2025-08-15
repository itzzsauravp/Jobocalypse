import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDocumentDTO } from './dtos/create-document.dto';

@Injectable()
export class DocumentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMultipleDocsBusiness(id: string, dto: CreateDocumentDTO[]) {
    return this.prismaService.documents.createMany({
      data: dto.map((item) => ({ ...item, businessID: id })),
    });
  }
}
