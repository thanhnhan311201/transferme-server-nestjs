import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

import IConfig, { IThirdPartyConfig } from 'config';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class GoogleAuthClient {
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

  async verifyAuthToken(auth: string) {
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
