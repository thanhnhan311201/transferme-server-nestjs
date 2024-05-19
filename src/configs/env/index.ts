import { generalConfig, IGeneralConfig } from './general.config';
import { authConfig, IAuthenticationConfig } from './authentication.config';
import { thirdPartyConfig, IThirdPartyConfig } from './third-party.config';
import { cacheConfig, ICacheConfig } from './cache.config';
import { databaseConfig, IDatabaseConfig } from './db.config';

export interface IConfig {
	auth: 'auth';
	redis: 'redis';
	general: 'general';
	thirdParty: 'thirdParty';
	database: 'database';
}

const envConfigs = [
	generalConfig,
	authConfig,
	thirdPartyConfig,
	cacheConfig,
	databaseConfig,
];

const rootConfig = {
	isGlobal: true,
	envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
	load: envConfigs,
	cache: true,
	expandVariables: true,
};

export {
	generalConfig,
	authConfig,
	thirdPartyConfig,
	cacheConfig,
	databaseConfig,
	IGeneralConfig,
	IAuthenticationConfig,
	ICacheConfig,
	IDatabaseConfig,
	IThirdPartyConfig,
};

export default rootConfig;
