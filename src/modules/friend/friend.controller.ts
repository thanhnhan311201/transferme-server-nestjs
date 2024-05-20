import { Controller, Delete, Get, Inject, Param } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CurrentUser } from '@modules/common/decorators';
import { User } from '@configs/typeorm';
import { IFriendService } from './interfaces';

import { ROUTES, SERVER_EVENTS, SERVICES } from '@utils/constants.util';

@Controller(ROUTES.FRIEND)
export class FriendController {
	constructor(
		@Inject(SERVICES.FRIEND_SERVICE)
		private readonly friendService: IFriendService,
		private readonly event: EventEmitter2,
	) {}

	@Get()
	getFriends(@CurrentUser() user: User) {
		console.log('Fetching Friends');
		return this.friendService.getFriends(user.id);
	}

	@Delete(':id/delete')
	async deleteFriend(
		@CurrentUser() { id: userId }: User,
		@Param('id') id: string,
	) {
		const friend = await this.friendService.deleteFriend({ id, userId });
		this.event.emit(SERVER_EVENTS.FRIEND_REMOVED, { friend, userId });
		return friend;
	}
}
