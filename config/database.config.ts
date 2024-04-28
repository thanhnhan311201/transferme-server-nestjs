export interface IDatabaseConfig {
  host: string;
  username: string;
  password: string;
  port: number;
  dbName: string;
  uri: string;
}

export const dbConfig = () => ({
  database: {
    host: process.env.MONGO_HOST,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    port: parseInt(process.env.MONGO_PORT) || 27017,
    dbName: process.env.MONGO_DB_NAME,
    uri: process.env.MONGO_URI,
  },
});
