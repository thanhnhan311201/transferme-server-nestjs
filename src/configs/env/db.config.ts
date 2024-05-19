export interface IDatabaseConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	dbName: string;
}

export const databaseConfig = () => ({
	database: {
		host: process.env.POSTGRES_HOST,
		port: parseInt(process.env.POSTGRES_PORT),
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		dbName: process.env.POSTGRES_DB,
	},
});
