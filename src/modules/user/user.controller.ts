import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CurrentUser } from '@modules/common/decorators';
import { STATUS } from '@modules/common/types';

import { UserDto } from './dtos';
import { IConfig } from '@configs/env';
import { IFriendshipService } from '@modules/friendship/interfaces';
import { IUserService } from './interfaces';
import { SERVICES } from '@utils/constants.util';

@Controller('user')
export class UserController {
	constructor(
		@Inject(SERVICES.USER_SERVICE)
		private readonly userService: IUserService,
		private readonly cfgService: ConfigService<IConfig>,
		@Inject(SERVICES.FRIENDSHIP_SERVICE)
		private readonly friendshipService: IFriendshipService,
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
