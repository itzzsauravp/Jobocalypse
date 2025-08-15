import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidatedEntity } from '../interface/auth.interface';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser extends ValidatedEntity = ValidatedEntity>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): any {
    const req: Request = context.switchToHttp().getRequest();
    req.entity = user;
    return user;
  }
}
