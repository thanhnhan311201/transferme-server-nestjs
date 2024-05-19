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
};

export type SocketWithAuth = Socket & AuthPayload;
