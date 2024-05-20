import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TransferringGateway } from '@modules/gateway/gateway.gateway';
import { FriendRequest } from '@configs/typeorm';
import { SERVER_EVENTS, SOCKET_EVENTS } from '@utils/constants.util';
import { AcceptFriendRequestResponse } from './types';

@Injectable()
export class FriendRequestEvent {
	constructor(private readonly gateway: TransferringGateway) {}

	@OnEvent('friendrequest.create')
	friendRequestCreate(payload: FriendRequest) {
		console.log('friendrequest.create');
		const receiverSocket = this.gateway.sessionManager.getUserSocket(
			payload.receiver.id,
		);
		receiverSocket && receiverSocket.emit('onFriendRequestReceived', payload);
	}

	@OnEvent('friendrequest.cancel')
	handleFriendRequestCancel(payload: FriendRequest) {
		console.log('friendrequest.cancel');
		const receiverSocket = this.gateway.sessionManager.getUserSocket(
			payload.receiver.id,
		);
		receiverSocket && receiverSocket.emit('onFriendRequestCancelled', payload);
	}

	@OnEvent(SERVER_EVENTS.FRIEND_REQUEST_ACCEPTED)
	handleFriendRequestAccepted(payload: AcceptFriendRequestResponse) {
		console.log(SERVER_EVENTS.FRIEND_REQUEST_ACCEPTED);
		const senderSocket = this.gateway.sessionManager.getUserSocket(
			payload.friendRequest.sender.id,
		);
		senderSocket &&
			senderSocket.emit(SOCKET_EVENTS.FRIEND_REQUEST_ACCEPTED, payload);
	}

	@OnEvent(SERVER_EVENTS.FRIEND_REQUEST_REJECTED)
	handleFriendRequestRejected(payload: FriendRequest) {
		console.log(SERVER_EVENTS.FRIEND_REQUEST_REJECTED);
		const senderSocket = this.gateway.sessionManager.getUserSocket(
			payload.sender.id,
		);
		senderSocket &&
			senderSocket.emit(SOCKET_EVENTS.FRIEND_REQUEST_REJECTED, payload);
	}
}
