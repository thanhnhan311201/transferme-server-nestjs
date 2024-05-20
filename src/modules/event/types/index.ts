import { Friend, FriendRequest } from '@configs/typeorm';

export type AcceptFriendRequestResponse = {
	friend: Friend;
	friendRequest: FriendRequest;
};

export type RemoveFriendEventPayload = {
	friend: Friend;
	userId: string;
};
