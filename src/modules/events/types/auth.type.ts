import { type Socket } from 'socket.io';

// guard types
export type AuthPayload = {
	user: {
		id: number;
		email: string;
		username: string;
		picture: string;
		friendList: string;
	};
	clientId: string;
	roomId: number;
};

export type SocketWithAuth = Socket & AuthPayload;
