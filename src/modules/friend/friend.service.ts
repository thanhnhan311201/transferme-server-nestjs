import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Friend } from '@configs/typeorm';

import { IConfig } from '@configs/env';
import { IFriendService } from './interfaces';
import { DeleteFriendRequestParams } from './types';

@Injectable({})
export class FriendService implements IFriendService {
	constructor(
		@InjectRepository(Friend)
		private readonly friendRepo: Repository<Friend>,
		private readonly cfgService: ConfigService<IConfig>,
	) {}

	getFriends(id: string): Promise<Friend[]> {
		return this.friendRepo.find({
			where: [{ sender: { id } }, { receiver: { id } }],
			relations: [
				'sender',
				'receiver',
				'sender.profile',
				'receiver.profile',
				'receiver.presence',
				'sender.presence',
			],
		});
	}

	findFriendById(id: string): Promise<Friend> {
		return this.friendRepo.findOne({
			where: { id },
			relations: [
				'sender',
				'receiver',
				'sender.profilePhoto',
				'sender.isOnline',
				'receiver.profilePhoto',
				'receiver.isOnline',
			],
		});
	}

	async deleteFriend({ id, userId }: DeleteFriendRequestParams) {
		const friend = await this.findFriendById(id);
		if (!friend) throw new NotFoundException('Friend not found!');

		if (friend.receiver.id !== userId && friend.sender.id !== userId)
			throw new BadRequestException('Cannot delete friend');

		await this.friendRepo.delete(id);
		return friend;
	}

	isFriends(userOneId: string, userTwoId: string) {
		return this.friendRepo.findOne({
			where: [
				{
					sender: { id: userOneId },
					receiver: { id: userTwoId },
				},
				{
					sender: { id: userTwoId },
					receiver: { id: userOneId },
				},
			],
		});
	}
}
