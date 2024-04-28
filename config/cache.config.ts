export interface ICacheConfig {
  redisUrl: string;
  redisHost: string;
  redisPort: number;
  refreshTokenTokenExpTime: number;
}

export const cacheConfig = () => ({
  redis: {
    redisUrl: process.env.REDIS_URL,
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT) || 6379,
    refreshTokenTokenExpTime:
      parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME_FOR_REDIS) || 28800,
  },
});
