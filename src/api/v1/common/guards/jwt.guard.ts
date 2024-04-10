import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  // handle jwt token expired
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || info || !user) {
      if (info?.name === 'TokenExpiredError')
        throw (
          err ||
          new UnauthorizedException({
            statusCode: 401,
            message: 'token expired',
            error: info?.name || 'TokenExpiredError',
          })
        );
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
