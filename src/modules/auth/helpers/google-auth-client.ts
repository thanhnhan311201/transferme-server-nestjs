import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Credentials, OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

import { IConfig, IThirdPartyConfig } from '@configs/env';

export class InvalidatedRefreshTokenError extends Error {}

export interface IGoogleAuthClient {
	verifyAuthToken(auth: string): Promise<TokenPayload>;
}

@Injectable()
export class GoogleAuthClient implements IGoogleAuthClient {
	private authClient: OAuth2Client;

	constructor(private cfgService: ConfigService<IConfig>) {
		this.authClient = new OAuth2Client({
			clientId: cfgService.get<IThirdPartyConfig>('thirdParty').google.clientId,
			clientSecret:
				cfgService.get<IThirdPartyConfig>('thirdParty').google.clientSecret,
			redirectUri:
				cfgService.get<IThirdPartyConfig>('thirdParty').google.redirectUri,
		});
	}

	async verifyAuthToken(auth: string): Promise<TokenPayload> {
		try {
			const r: { tokens: Credentials; res: any } =
				await this.authClient.getToken(auth);

			const ticket = await this.authClient.verifyIdToken({
				idToken: r.tokens.id_token,
				audience:
					this.cfgService.get<IThirdPartyConfig>('thirdParty').google.clientId,
			});

			const payload = ticket.getPayload();
			if (!payload) {
				throw new UnauthorizedException('User not found!');
			}

			return payload;
		} catch (error) {
			throw new UnauthorizedException('Invalid google id token!');
		}
	}
}
