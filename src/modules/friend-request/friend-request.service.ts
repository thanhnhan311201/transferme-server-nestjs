import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IFriendService } from '@modules/friend/interfaces';
import { IUserService } from '@modules/user/interfaces';
import { IFriendRequestService } from './interfaces';
import {
	CancelFriendRequestParams,
	CreateFriendParams,
	FRIEND_REQUEST_STATUS,
	FriendRequestParams,
} from './types';
import { FriendRequest, Friend } from '@configs/typeorm';
import { SERVICES } from '@utils/constants.util';
import { isEmpty } from 'class-validator';

@Injectable()
export class FriendRequestService implements IFriendRequestService {
	constructor(
		@InjectRepository(Friend)
		private readonly friendRepository: Repository<Friend>,
		@InjectRepository(FriendRequest)
		private readonly friendRequestRepository: Repository<FriendRequest>,
		@Inject(SERVICES.USER_SERVICE)
		private readonly userService: IUserService,
		@Inject(SERVICES.FRIEND_SERVICE)
		private readonly friendService: IFriendService,
	) {}

	getFriendRequests(id: string): Promise<FriendRequest[]> {
		const status = FRIEND_REQUEST_STATUS.PENDING;
		return this.friendRequestRepository.find({
			where: [
				{ sender: { id }, status },
				{ receiver: { id }, status },
			],
			relations: [
				'receiver',
				'sender',
				'sender.profilePhoto',
				'receiver.profilePhoto',
			],
		});
	}

	async cancel({ id, userId }: CancelFriendRequestParams) {
		const friendRequest = await this.findById(id);
		if (!friendRequest)
			throw new BadRequestException('Friend Request not found');

		if (friendRequest.sender.id !== userId)
			throw new BadRequestException('Friend Request Already Accepted');

		await this.friendRequestRepository.delete(id);
		return friendRequest;
	}

	async create({ user: sender, email }: CreateFriendParams) {
		const users = await this.userService.find(email);
		if (isEmpty(users)) {
			throw new NotFoundException('User (receiver) not found!');
		}
		const receiver = users[0];
		if (!receiver) throw new NotFoundException('User (receiver) not found!');

		const exists = await this.isPending(sender.id, receiver.id);

		if (exists) throw new BadRequestException('Friend Requesting Pending');

		if (receiver.id === sender.id)
			throw new BadRequestException('Cannot Add Yourself');

		const isFriends = await this.friendService.isFriends(
			sender.id,
			receiver.id,
		);

		if (isFriends) throw new ConflictException('Friend Already Exists');
		const friend = this.friendRequestRepository.create({
			sender,
			receiver,
			status: FRIEND_REQUEST_STATUS.PENDING,
		});

		return this.friendRequestRepository.save(friend);
	}

	async accept({ id, userId }: FriendRequestParams) {
		const friendRequest = await this.findById(id);

		if (!friendRequest)
			throw new BadRequestException('Friend Request not found');

		if (friendRequest.status === 'accepted')
			throw new BadRequestException('Friend Request Already Accepted');

		if (friendRequest.receiver.id !== userId)
			throw new BadRequestException('Friend Request Exception');

		friendRequest.status = FRIEND_REQUEST_STATUS.ACCEPTED;
		const updatedFriendRequest =
			await this.friendRequestRepository.save(friendRequest);
		const newFriend = this.friendRepository.create({
			sender: friendRequest.sender,
			receiver: friendRequest.receiver,
		});
		const friend = await this.friendRepository.save(newFriend);

		return { friend, friendRequest: updatedFriendRequest };
	}

	async reject({ id, userId }: CancelFriendRequestParams) {
		const friendRequest = await this.findById(id);
		if (!friendRequest)
			throw new BadRequestException('Friend Request not found');

		if (friendRequest.status === 'accepted')
			throw new BadRequestException('Friend Request Already Accepted');

		if (friendRequest.receiver.id !== userId)
			throw new BadRequestException('Friend Request Exception');

		friendRequest.status = FRIEND_REQUEST_STATUS.REJECTED;

		return this.friendRequestRepository.save(friendRequest);
	}

	isPending(userOneId: string, userTwoId: string) {
		return this.friendRequestRepository.findOne({
			where: [
				{
					sender: { id: userOneId },
					receiver: { id: userTwoId },
					status: FRIEND_REQUEST_STATUS.PENDING,
				},
				{
					sender: { id: userTwoId },
					receiver: { id: userOneId },
					status: FRIEND_REQUEST_STATUS.PENDING,
				},
			],
		});
	}

	findById(id: string): Promise<FriendRequest> {
		return this.friendRequestRepository.findOne({
			where: { id },
			relations: ['receiver', 'sender'],
		});
	}
}
