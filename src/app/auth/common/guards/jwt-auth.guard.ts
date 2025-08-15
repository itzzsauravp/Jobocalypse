import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ValidatedEntity } from '../interface/auth.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
