import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
	Strategy,
	ExtractJwt,
	StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import { UserDto } from '@modules/user/dtos';

import { JwtPayload } from '../types';
import { IConfig, IAuthenticationConfig } from '@configs/env';
import { IUserService } from '@modules/user/interfaces';
import { SERVICES } from '@utils/constants.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		@Inject(SERVICES.USER_SERVICE)
		private userService: IUserService,
		private cfgService: ConfigService<IConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: cfgService.get<IAuthenticationConfig>('auth').secretJwtKey,
		} as StrategyOptionsWithoutRequest);
		this.logger.warn('JwtStrategy initialized');
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
