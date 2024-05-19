import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { UserModule } from '@modules/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, JwtRefreshStrategy } from './strategies';
import { RefreshTokenStorage } from './helpers/refresh-token-storage';
import { GoogleAuthClient } from './helpers/google-auth-client';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [UserModule, PassportModule, JwtModule, HttpModule],
	controllers: [AuthController],
	providers: [
		{
			provide: SERVICES.AUTH_SERVICE,
			useClass: AuthService,
		},
		JwtStrategy,
		JwtRefreshStrategy,
		{
			provide: SERVICES.REFRESH_TOKEN_STORAGE,
			useClass: RefreshTokenStorage,
		},
		{
			provide: SERVICES.GOOGLE_AUTH_CLIENT,
			useClass: GoogleAuthClient,
		},
	],
	exports: [
		{
			provide: SERVICES.AUTH_SERVICE,
			useClass: AuthService,
		},
	],
})
export class AuthModule {}
