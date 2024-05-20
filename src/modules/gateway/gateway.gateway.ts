import { Inject, Logger } from '@nestjs/common';
import {
	ConnectedSocket,
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

import { AuthenticatedSocket } from './types';
import { SOCKET_EVENTS } from '@utils/constants.util';
import { IGatewaySessionManager } from './gateway.session';
import { IAuthService } from '@modules/auth/interfaces';
import { SERVICES } from '@utils/constants.util';

@WebSocketGateway()
export class TransferringGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(WebSocketGateway.name);

	constructor(
		@Inject(SERVICES.AUTH_SERVICE)
		private readonly authService: IAuthService,
		@Inject(SERVICES.GATEWAY_SESSION_MANAGER)
		readonly sessionManager: IGatewaySessionManager,
	) {}

	// handle after init io server
	afterInit(): void {
		this.logger.log('Websocket Gateway initialized.');
	}

	handleConnection(client: AuthenticatedSocket): void {
		const ioServer = this.server.of('/');

		this.logger.debug(
			`Socket connected with userID: ${client.user.id}, and email: "${client.user.email}"`,
		);
		this.logger.log(`WS Client with id: ${client.id} connected!`);
		this.logger.debug(`Number of connected sockets: ${ioServer.sockets.size}`);

		client.join(client.roomId);

		const onlineUsers: {
			id: string;
			email: string;
			username: string;
			profilePhoto: string;
			clientId: string;
		}[] = [];

		const roomSockets = ioServer.adapter.rooms.get(client.roomId);
		if (roomSockets) {
			for (const socketId of roomSockets) {
				if (socketId === client.id) {
					continue;
				}
				const _client: any = ioServer.sockets.get(socketId);
				if (_client) {
					onlineUsers.push({
						id: _client.user.id,
						clientId: _client.clientId,
						email: _client.user.email,
						username: _client.user.username,
						profilePhoto: _client.user.profilePhoto,
					});
				}
			}
		}

		client.emit(SOCKET_EVENTS.NEW_CONNECTION, {
			action: 'login',
			userInfo: client.user,
			onlineUsers,
			clientId: client.clientId,
		});
		client.broadcast.to(client.roomId).emit(SOCKET_EVENTS.NEW_CONNECTION, {
			action: 'new_user_login',
			userInfo: null,
			onlineUsers: [
				{
					id: client.user.id,
					clientId: client.clientId,
					email: client.user.email,
					username: client.user.username,
					profilePhoto: client.user.profilePhoto,
				},
			],
			clientId: '',
		});
	}

	handleDisconnect(client: AuthenticatedSocket): void {
		const ioServer = this.server.of('/');

		client.broadcast
			.to(client.roomId)
			.emit(SOCKET_EVENTS.USER_LOGOUT, client.user.id);
		client.leave(client.roomId);

		this.logger.log(`Disconnected socket id: ${client.id}`);
		this.logger.debug(`Number of connected sockets: ${ioServer.sockets.size}`);
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

	// ----------------------------------Event listeners-------------------------------
	@SubscribeMessage(SOCKET_EVENTS.REQUEST_SEND_FILE)
	handleRequestTransfer(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: { receivedClientId: string },
	) {
		const ioServer = this.server.of('/');

		if (!data.receivedClientId) {
			return client.emit('error', { message: 'The user not found!' });
		}

		const receivedSocket = this.sessionManager.getUserSocket(
			data.receivedClientId,
		);

		if (!receivedSocket) {
			return client.emit('error', { message: 'The device not found!' });
		}

		const transferRoom = `${client.clientId}_${data.receivedClientId}`;
		client.transferRoom = transferRoom;
		receivedSocket.transferRoom = transferRoom;
		client.join(transferRoom);
		receivedSocket.join(transferRoom);

		ioServer
			.to(receivedSocket.id)
			.emit(SOCKET_EVENTS.WAIT_TRANSFER_ACCEPTED, client.user.email);
	}

	@SubscribeMessage(SOCKET_EVENTS.SEND_FILE)
	handleSendFile(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody()
		data: {
			file: {
				fileData: ArrayBuffer;
				fileName: string;
				fileType: string;
				fileSize: number;
				totalChunk: number;
				countChunkId: number;
			};
		},
	) {
		client.broadcast
			.to(client.transferRoom)
			.emit(SOCKET_EVENTS.RECEIVE_FILE, data.file);
	}

	@SubscribeMessage(SOCKET_EVENTS.REPLY_TO_REQUEST)
	handleResponse(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody()
		data: { confirm: boolean },
	) {
		const ioServer = this.server.of('/');

		if (data.confirm) {
			client.broadcast
				.to(client.transferRoom)
				.emit(SOCKET_EVENTS.ACCEPT_REQUEST);
		} else {
			client.broadcast
				.to(client.transferRoom)
				.emit(SOCKET_EVENTS.REFUSE_REQUEST);
			ioServer.in(client.transferRoom).socketsLeave(client.transferRoom);
		}
	}

	@SubscribeMessage(SOCKET_EVENTS.ACK_RECEIVE_FILE)
	handleAcknowledge(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody()
		data: { ack: { done: boolean; receivedChunk: number; totalChunk: number } },
	) {
		const ioServer = this.server.of('/');

		client.broadcast
			.to(client.transferRoom)
			.emit(SOCKET_EVENTS.ON_ACK_RECEIVE_FILE, data.ack);

		if (data.ack.done) {
			ioServer.in(client.transferRoom).socketsLeave(client.transferRoom);
		}
	}

	@SubscribeMessage(SOCKET_EVENTS.CANCEL_TRANSFER)
	handleCancelTransfer(@ConnectedSocket() client: AuthenticatedSocket) {
		client.broadcast
			.to(client.transferRoom)
			.emit(SOCKET_EVENTS.ON_CANCEL_TRANSFER);
	}
}
