import { type Socket } from 'socket.io';

// guard types
export type AuthPayload = {
	user: {
		id: string;
		email: string;
		username: string;
		profilePhoto: string;
	};
	clientId: string;
	roomId: string;
	transferRoom: string;
};

export type AuthenticatedSocket = Socket & AuthPayload;
