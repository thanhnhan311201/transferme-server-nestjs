import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TransferringGateway } from '@modules/gateway/gateway.gateway';

import { SERVER_EVENTS } from '@utils/constants.util';
import { RemoveFriendEventPayload } from './types';

@Injectable()
export class FriendEvent {
	constructor(private readonly gateway: TransferringGateway) {}

	@OnEvent(SERVER_EVENTS.FRIEND_REMOVED)
	handleFriendRemoved({ userId, friend }: RemoveFriendEventPayload) {
		const { sender, receiver } = friend;
		console.log(SERVER_EVENTS.FRIEND_REMOVED);
		const socket = this.gateway.sessionManager.getUserSocket(
			receiver.id === userId ? sender.id : receiver.id,
		);
		console.log(`Emitting Event for ${socket?.user?.username}`);
		socket?.emit('onFriendRemoved', friend);
	}
}
