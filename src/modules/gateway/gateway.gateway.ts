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
import { socketRecord } from './utils';

@WebSocketGateway()
export class TransferringGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(WebSocketGateway.name);

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

		client.join(client.roomId);

		const onlineUsers: {
			id: string;
			email: string;
			username: string;
			profilePhoto: string;
			clientId: string;
		}[] = [];

		const roomSockets = this.server.of('/').adapter.rooms.get(client.roomId);
		if (roomSockets) {
			for (const socketId of roomSockets) {
				if (socketId === client.id) {
					continue;
				}
				const _client: any = sockets.get(socketId);
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

	handleDisconnect(client: SocketWithAuth): any {
		const sockets = this.server.of('/').sockets;

		client.broadcast
			.to(client.roomId)
			.emit(SOCKET_EVENTS.USER_LOGOUT, client.user.id);
		client.leave(client.roomId);

		this.logger.log(`Disconnected socket id: ${client.id}`);
		this.logger.debug(`Number of connected sockets: ${sockets.size}`);
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
	handleRequestTransfer(client: any, receivedClientId: string) {
		if (!receivedClientId) {
			return client.emit('error', { message: 'The user not found!' });
		}

		const receivedSocketId = socketRecord.get(receivedClientId);
		if (!receivedSocketId) {
			return client.emit('error', { message: 'The user not found!' });
		}

		const receivedSocket = this.server.of('/').sockets.get(receivedSocketId);
		if (!receivedSocket) {
			return client.emit('error', { message: 'The device not found!' });
		}

		const transferRoom = `${client.clientId}_${receivedClientId}`;
		client.transferRoom = transferRoom;
		(receivedSocket as any).transferRoom = transferRoom;
		client.join(transferRoom);
		receivedSocket.join(transferRoom);

		this.server
			.of('/')
			.to(receivedSocketId)
			.emit(SOCKET_EVENTS.WAIT_TRANSFER_ACCEPTED, client.user.email);
	}

	@SubscribeMessage(SOCKET_EVENTS.SEND_FILE)
	handleSendFile(
		client: any,
		file: {
			fileData: ArrayBuffer;
			fileName: string;
			fileType: string;
			fileSize: number;
			totalChunk: number;
			countChunkId: number;
		},
	) {
		client.broadcast
			.to(client.transferRoom)
			.emit(SOCKET_EVENTS.RECEIVE_FILE, file);
	}

	@SubscribeMessage(SOCKET_EVENTS.REPLY_TO_REQUEST)
	handleResponse(client: any, confirm: boolean) {
		if (confirm) {
			client.broadcast
				.to(client.transferRoom)
				.emit(SOCKET_EVENTS.ACCEPT_REQUEST);
		} else {
			client.broadcast
				.to(client.transferRoom)
				.emit(SOCKET_EVENTS.REFUSE_REQUEST);
			this.server
				.of('/')
				.in(client.transferRoom)
				.socketsLeave(client.transferRoom);
		}
	}

	@SubscribeMessage(SOCKET_EVENTS.ACK_RECEIVE_FILE)
	handleAcknowledge(
		client: any,
		ack: { done: boolean; receivedChunk: number; totalChunk: number },
	) {
		client.broadcast
			.to(client.transferRoom)
			.emit(SOCKET_EVENTS.ON_ACK_RECEIVE_FILE, ack);

		if (ack.done) {
			this.server
				.of('/')
				.in(client.transferRoom)
				.socketsLeave(client.transferRoom);
		}
	}

	@SubscribeMessage(SOCKET_EVENTS.CANCEL_TRANSFER)
	handleCancelTransfer(client: any) {
		client.broadcast
			.to(client.transferRoom)
			.emit(SOCKET_EVENTS.ON_CANCEL_TRANSFER);
	}
}
