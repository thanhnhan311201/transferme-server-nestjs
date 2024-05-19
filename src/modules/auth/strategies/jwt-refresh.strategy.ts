import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
	Strategy,
	ExtractJwt,
	StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import { UserService } from '@modules/user/user.service';
import { UserDto } from '@modules/user/dtos';

import { JwtPayload } from '../types';
import { IConfig, IAuthenticationConfig } from '@configs/env';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwtRefresh',
) {
	private readonly logger = new Logger(JwtRefreshStrategy.name);

	constructor(
		private userService: UserService,
		private cfgService: ConfigService<IConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey:
				cfgService.get<IAuthenticationConfig>('auth').secretJwtRefreshKey,
		} as StrategyOptionsWithoutRequest);
		this.logger.warn('JwtRefreshStrategy initialized');
	}

	async validate(payload: JwtPayload): Promise<UserDto> {
		this.logger.warn(`Payload: ${JSON.stringify(payload)}`);

		const user = await this.userService.findOne(payload.sub);
		if (!user) {
			this.logger.error('User not found');
			throw new ForbiddenException();
		}
		return user;
	}
}
