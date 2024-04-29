export interface IGeneralConfig {
	port: number;
	baseUrlApi: string;
	baseUrlServer: string;
	baseUrlClient: string;
}

export const generalConfig = () => ({
	general: {
		port: parseInt(process.env.PORT) || 8080,
		baseUrlApi: process.env.BASE_URL_API,
		baseUrlServer: process.env.BASE_URL_SERVER,
		baseUrlClient: process.env.BASE_URL_CLIENT,
	},
});
