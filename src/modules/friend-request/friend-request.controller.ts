import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CurrentUser } from '@modules/common/decorators';

import { ROUTES, SERVER_EVENTS, SERVICES } from '@utils/constants.util';
import { IFriendRequestService } from './interfaces';
import { User } from '@configs/typeorm';
import { CreateFriendDto } from './dtos/create-friend.dto';

@Controller(ROUTES.FRIEND_REQUEST)
export class FriendRequestController {
	constructor(
		@Inject(SERVICES.FRIEND_REQUEST_SERVICE)
		private readonly friendRequestService: IFriendRequestService,
		private event: EventEmitter2,
	) {}

	@Get()
	getFriendRequests(@CurrentUser() user: User) {
		return this.friendRequestService.getFriendRequests(user.id);
	}

	@Post()
	async createFriendRequest(
		@CurrentUser() user: User,
		@Body() { email }: CreateFriendDto,
	) {
		const params = { user, email };
		const friendRequest = await this.friendRequestService.create(params);
		this.event.emit(SERVER_EVENTS.FRIEND_REQUEST_CREATE, friendRequest);
		return friendRequest;
	}

	@Patch(':id/accept')
	async acceptFriendRequest(
		@CurrentUser() { id: userId }: User,
		@Param('id') id: string,
	) {
		const response = await this.friendRequestService.accept({ id, userId });
		this.event.emit(SERVER_EVENTS.FRIEND_REQUEST_ACCEPTED, response);
		return response;
	}

	@Delete(':id/cancel')
	async cancelFriendRequest(
		@CurrentUser() { id: userId }: User,
		@Param('id') id: string,
	) {
		const response = await this.friendRequestService.cancel({ id, userId });
		this.event.emit(SERVER_EVENTS.FRIEND_REQUEST_CANCEL, response);
		return response;
	}

	@Patch(':id/reject')
	async rejectFriendRequest(
		@CurrentUser() { id: userId }: User,
		@Param('id') id: string,
	) {
		const response = await this.friendRequestService.reject({ id, userId });
		this.event.emit(SERVER_EVENTS.FRIEND_REQUEST_REJECTED, response);
		return response;
	}
}
