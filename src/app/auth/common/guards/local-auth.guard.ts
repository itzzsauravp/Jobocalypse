import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidatedEntity } from '../interface/auth.interface';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser extends ValidatedEntity = ValidatedEntity>(
    err: Error,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): any {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    const req: Request = context.switchToHttp().getRequest();
    req.entity = user;
    return user;
  }
}
