import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class GoogleAuthClient {
  private authClient: OAuth2Client;

  constructor(private cfgService: ConfigService) {
    this.authClient = new OAuth2Client({
      clientId: cfgService.get<string>(
        'thirdParty.google.CREDENTIAL_CLIENT_ID',
      ),
      clientSecret: cfgService.get<string>(
        'thirdParty.google.CREDENTIAL_CLIENT_SECRET',
      ),
      redirectUri: cfgService.get<string>('thirdParty.google.REDIRECT_URL'),
    });
  }

  async verifyAuthToken(auth: string) {
    try {
      const r: { tokens: Credentials; res: any } =
        await this.authClient.getToken(auth);

      const ticket = await this.authClient.verifyIdToken({
        idToken: r.tokens.id_token,
        audience: this.cfgService.get<string>(
          'thirdParty.google.CREDENTIAL_CLIENT_ID',
        ),
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
