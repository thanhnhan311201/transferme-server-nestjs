export default () => ({
  PORT: parseInt(process.env.PORT) || 8080,
  BASE_URL_API: process.env.BASE_URL_API,
  BASE_URL_SERVER: process.env.BASE_URL_SERVER,
  BASE_URL_CLIENT: process.env.BASE_URL_CLIENT,
  redis: {
    REDIS_URL: process.env.REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
    REFRESH_TOKEN_EXPIRATION_TIME_FOR_REDIS:
      parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME_FOR_REDIS) || 28800,
  },
  auth: {
    ACCESS_TOKEN_EXPIRATION_TIME:
      process.env.ACCESS_TOKEN_EXPIRATION_TIME || '2h',
    REFRESH_TOKEN_EXPIRATION_TIME:
      process.env.REFRESH_TOKEN_EXPIRATION_TIME || '8h',
    SECRET_JWT_KEY: process.env.SECRET_JWT_KEY || 'accessSecret',
    SECRET_JWT_REFRESH_KEY:
      process.env.SECRET_JWT_REFRESH_KEY || 'refreshSecret',
  },
  thirdParty: {
    google: {
      CREDENTIAL_CLIENT_ID: process.env.GOOGLE_CREDENTIAL_CLIENT_ID,
      CREDENTIAL_CLIENT_SECRET: process.env.GOOGLE_CREDENTIAL_CLIENT_SECRET,
      REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
      CREDENTIAL_REFRESH_TOKEN: process.env.GOOGLE_CREDENTIAL_REFRESH_TOKEN,
    },
    github: {
      CREDENTIAL_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      CREDENTIAL_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
