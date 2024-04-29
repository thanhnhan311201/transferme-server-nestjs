import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
	Strategy,
	ExtractJwt,
	StrategyOptionsWithoutRequest,
} from 'passport-jwt';

import { UserService } from '../../user/user.service';

import { JwtPayload } from '../types';
import IConfig, { IAuthenticationConfig } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	private readonly logger = new Logger(JwtStrategy.name);

	constructor(
		// eslint-disable-next-line no-unused-vars
		private userService: UserService,
		private cfgService: ConfigService<IConfig>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: cfgService.get<IAuthenticationConfig>('auth').secretJwtKey,
		} as StrategyOptionsWithoutRequest);
		this.logger.warn('JwtStrategy initialized');
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
