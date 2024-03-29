export type JwtPayload = {
  userId: number;
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
