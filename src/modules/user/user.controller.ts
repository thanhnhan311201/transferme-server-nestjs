import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { FriendshipService } from '@modules/friendship/friendship.service';
import { CurrentUser } from '@modules/common/decorators';
import { STATUS } from '@modules/common/types';

import { UserDto } from './dtos';
import { IConfig } from '@configs/env';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private cfgService: ConfigService<IConfig>,
		private friendshipService: FriendshipService,
	) {}

	@Get('info')
	@HttpCode(HttpStatus.OK)
	async getInfo(@CurrentUser() user: UserDto) {
		const foundUser = await this.userService.getUserInfoWithRelation(user.id);

		return { status: STATUS.SUCCESS, data: foundUser };
	}

	@Post('make-friend')
	@HttpCode(HttpStatus.OK)
	async makeFriend(
		@CurrentUser() user: UserDto,
		@Body() body: { recipientId: string },
	) {
		const done = await this.friendshipService.createFriendRequest({
			senderId: user.id,
			recipientId: body.recipientId,
		});

		if (!done) {
			throw new BadRequestException('There is an error!.');
		}

		return { status: STATUS.SUCCESS };
	}
}
