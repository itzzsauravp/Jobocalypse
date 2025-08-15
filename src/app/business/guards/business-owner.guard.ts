import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BusinessService } from '../business.service';
import { Request } from 'express';

@Injectable()
export class BusinessOwnerGuard implements CanActivate {
  constructor(private readonly businessService: BusinessService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.entity;
    const business = await this.businessService.findByOwnerID(user.id);
    if (!business) return false;
    request.businessID = business.id;
    return true;
  }
}
