export type JwtPayload = {
	sub: string;
	email: string;
};

export type Tokens = {
	accessToken: string;
	refreshToken: string;
};
