export default () => ({
  port: parseInt(process.env.PORT) || 8080,
  baseUrlApi: process.env.BASE_URL_API,
  baseUrlServer: process.env.BASE_URL_SERVER,
  baseUrlClient: process.env.BASE_URL_CLIENT,
  auth: {
    tokenExpirationTime: process.env.TOKEN_EXPIRATION_TIME || '24h',
    secretJwtKey:
      process.env.SECRET_JWT_KEY || 'transfermeisasupperuserfultool',
  },
  thirdParty: {
    google: {
      credentialClientId: process.env.GOOGLE_CREDENTIAL_CLIENT_ID,
      credentialClientSecret: process.env.GOOGLE_CREDENTIAL_CLIENT_SECRET,
      redirectUrl: process.env.GOOGLE_REDIRECT_URL,
      credentialRefreshToken: process.env.GOOGLE_CREDENTIAL_REFRESH_TOKEN,
    },
    github: {
      credentialClientId: process.env.GITHUB_CREDENTIAL_CLIENT_ID,
      credentialClientSecret: process.env.GITHUB_CREDENTIAL_CLIENT_SECRET,
    },
  },
});
