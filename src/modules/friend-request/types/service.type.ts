import { User, FriendRequest, Friend } from '@configs/typeorm';

export type FriendRequestParams = {
	id: string;
	userId: string;
};

export type CancelFriendRequestParams = {
	id: string;
	userId: string;
};

export type DeleteFriendRequestParams = {
	id: string;
	userId: string;
};

export type CreateFriendParams = {
	user: User;
	email: string;
};

export type AcceptFriendRequestResponse = {
	friend: Friend;
	friendRequest: FriendRequest;
};
