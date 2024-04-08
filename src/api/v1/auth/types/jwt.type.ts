export type JwtPayload = {
  sub: number;
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
