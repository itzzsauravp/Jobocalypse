import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Applicant, APPLICATION_STATUS } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicantService {
  constructor(private readonly prismaService: PrismaService) {}
  async updateApplicantStatus(
    id: string,
    status: APPLICATION_STATUS,
  ): Promise<Applicant> {
    try {
      const applicant = await this.prismaService.applicant.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
      return applicant;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Some thing when wrong when upadting the applicant status',
      );
    }
  }

  async deleteApplication(
    applicationID: string,
    vacancyID: string,
    businessID: string,
  ) {
    if (!applicationID || !businessID || !vacancyID) {
      throw new BadRequestException('Missing required IDs');
    }

    try {
      const application = await this.prismaService.applicant.findFirst({
        where: {
          id: applicationID,
          vacancy: {
            id: vacancyID,
            businessID,
          },
        },
      });

      if (!application) {
        throw new UnauthorizedException(
          'Application not found for this vacancy and business',
        );
      }

      const deletedApplication = await this.prismaService.applicant.delete({
        where: {
          id: applicationID,
        },
      });

      return deletedApplication;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
