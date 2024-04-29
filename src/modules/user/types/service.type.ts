import { PROVIDER } from './provider.type';

export type CreateUser = {
	email: string;
	password: string;
	username: string;
	profilePhoto?: string;
	provider?: PROVIDER;
};
