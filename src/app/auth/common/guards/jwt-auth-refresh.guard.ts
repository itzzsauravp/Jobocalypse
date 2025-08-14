import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidatedEntity } from '../../auth.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthRefreshGuard extends AuthGuard('jwt-refresh') {
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
