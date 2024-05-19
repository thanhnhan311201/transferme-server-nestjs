export interface IAuthenticationConfig {
	accessTokenExpTime: string;
	refreshTokenExpTime: string;
	secretJwtKey: string;
	secretJwtRefreshKey: string;
}

export const authConfig = () => ({
	auth: {
		accessTokenExpTime: process.env.ACCESS_TOKEN_EXPIRATION_TIME || '2h',
		refreshTokenExpTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME || '8h',
		secretJwtKey: process.env.SECRET_JWT_KEY || 'accessSecret',
		secretJwtRefreshKey: process.env.SECRET_JWT_REFRESH_KEY || 'refreshSecret',
	},
});
