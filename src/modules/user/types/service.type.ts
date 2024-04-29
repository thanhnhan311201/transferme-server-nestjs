export type CreateUser = {
	email: string;
	password: string;
	username: string;
	profilePhoto?: string;
	provider?: string;
};
