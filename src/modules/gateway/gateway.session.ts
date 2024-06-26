import { Injectable } from '@nestjs/common';

import { AuthenticatedSocket } from './types';

export interface IGatewaySessionManager {
	getUserSocket(id: string): AuthenticatedSocket;
	setUserSocket(id: string, socket: AuthenticatedSocket): void;
	removeUserSocket(id: string): void;
	getAllSocketId(): IterableIterator<string>;
	getSockets(): Map<string, AuthenticatedSocket>;
}

@Injectable({})
export class GatewaySessionManager implements IGatewaySessionManager {
	private readonly sessions: Map<string, AuthenticatedSocket> = new Map();

	getUserSocket(id: string): AuthenticatedSocket {
		return this.sessions.get(id);
	}

	setUserSocket(userId: string, socket: AuthenticatedSocket) {
		this.sessions.set(userId, socket);
	}

	removeUserSocket(userId: string) {
		this.sessions.delete(userId);
	}

	getAllSocketId(): IterableIterator<string> {
		return this.sessions.keys();
	}

	getSockets(): Map<string, AuthenticatedSocket> {
		return this.sessions;
	}
}
