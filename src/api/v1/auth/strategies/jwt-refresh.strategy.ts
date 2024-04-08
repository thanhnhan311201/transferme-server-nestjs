import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import { UserService } from '../../user/user.service';

import { JwtPayload } from '../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    private userService: UserService,
    private cfgService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfgService.get<string>('auth.secretJwtRefreshKey'),
    } as StrategyOptionsWithoutRequest);
    this.logger.warn('JwtRefreshStrategy initialized');
  }

  async validate(payload: JwtPayload): Promise<any> {
    this.logger.warn(`Payload: ${JSON.stringify(payload)}`);

    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      this.logger.error('User not found');
      throw new ForbiddenException();
    }
    return user;
  }
}
