import { Logger } from '@nestjs/common';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

import { AuthService } from '@modules/auth/auth.service';

import { SocketWithAuth, SOCKET_EVENTS } from './types';

@WebSocketGateway()
export class EventsGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(WebSocketGateway.name);

	// eslint-disable-next-line no-unused-vars
	constructor(private authService: AuthService) {}

	// handle after init io server
	afterInit(): any {
		this.logger.log('Websocket Gateway initialized.');
	}

	handleConnection(client: SocketWithAuth): any {
		const sockets = this.server.of('/').sockets;

		this.logger.debug(
			`Socket connected with userID: ${client.user.id}, and email: "${client.user.email}"`,
		);
		this.logger.log(`WS Client with id: ${client.id} connected!`);
		this.logger.debug(`Number of connected sockets: ${sockets.size}`);

		client.join(client.roomId.toString());
	}

	handleDisconnect(client: SocketWithAuth): any {
		const sockets = this.server.of('/').sockets;

		this.logger.log(`Disconnected socket id: ${client.id}`);
		this.logger.debug(`Number of connected sockets: ${sockets.size}`);

		client.broadcast
			.to(client.roomId.toString())
			.emit(SOCKET_EVENTS.USER_LOGOUT, client.user.id);
		client.leave(client.roomId.toString());
	}

	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
		console.log(data);
		return from([1, 2, 3]).pipe(
			map((item) => ({ event: 'events', data: item })),
		);
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}
}
