import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AUTH_ENTITY } from './auth-entity.guard';
import { Request } from 'express';
import { Role } from 'src/common/interfaces/role.inteface';

/**
 * this guard will attach the `@AuthEnity's` decorator value to the request as `request.authEntity` which is then used in a resolver inside of the AuthService to make user of either admin | user | firm
 */
@Injectable()
export class MetadataGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const entity = this.reflector.get<Role>(AUTH_ENTITY, context.getHandler());
    request.authEntity = entity;
    return true;
  }
}
