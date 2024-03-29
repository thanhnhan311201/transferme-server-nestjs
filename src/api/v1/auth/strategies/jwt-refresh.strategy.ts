import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserService } from '../../user/user.service';

import { JwtPayload } from '../types';
import type { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_JWT_REFRESH_KEY || 'refreshSecret',
      passRegToCallback: true,
    });
    this.logger.warn('JwtRefreshStrategy initialized');
  }

  async validate(req: Request, payload: JwtPayload): Promise<any> {
    this.logger.warn(`Payload: ${JSON.stringify(payload)}`);

    const user = await this.userService.findOne(payload.userId);
    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }
    return user;
  }
}
