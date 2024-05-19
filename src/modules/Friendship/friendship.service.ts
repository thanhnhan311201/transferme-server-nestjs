import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Friendship } from '@configs/typeorm';

import { IConfig } from '@configs/env';
import { UserService } from '@modules/user/user.service';

@Injectable({})
export class FriendshipService {
	constructor(
		@InjectRepository(Friendship)
		private friendshipRepo: Repository<Friendship>,
		private cfgService: ConfigService<IConfig>,
		private userService: UserService,
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
