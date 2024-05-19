import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Friendship } from '@configs/typeorm';

import { IConfig } from '@configs/env';
import { IFriendshipService } from './interfaces';
import { IUserService } from '@modules/user/interfaces';
import { SERVICES } from '@utils/constants.util';

@Injectable({})
export class FriendshipService implements IFriendshipService {
	constructor(
		@InjectRepository(Friendship)
		private readonly friendshipRepo: Repository<Friendship>,
		private readonly cfgService: ConfigService<IConfig>,
		@Inject(SERVICES.USER_SERVICE)
		private readonly userService: IUserService,
	) {}

	async createFriendRequest(payload: {
		senderId: string;
		recipientId: string;
	}): Promise<boolean> {
		const sender = await this.userService.findOne(payload.senderId);
		if (!sender) {
			throw new NotFoundException('User (sender) not found!');
		}
		const recipient = await this.userService.findOne(payload.recipientId);
		if (!recipient) {
			throw new NotFoundException('User (recipient) not found!');
		}

		const friendship = this.friendshipRepo.create({
			user: sender,
			friend: recipient,
		});
		await this.friendshipRepo.save(friendship);

		return true;
	}
}
