export * from './general.config';
export * from './authentication.config';
export * from './cache.config';
export * from './third-party.config';

export default interface IConfig {
	auth: 'auth';
	redis: 'redis';
	general: 'general';
	thirdParty: 'thirdParty';
}
