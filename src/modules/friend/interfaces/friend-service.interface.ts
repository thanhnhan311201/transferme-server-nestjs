import { DeleteFriendRequestParams } from '../types';
import { Friend } from '@configs/typeorm';

export interface IFriendService {
	getFriends(id: string): Promise<Friend[]>;
	findFriendById(id: string): Promise<Friend>;
	deleteFriend(params: DeleteFriendRequestParams);
	isFriends(userOneId: string, userTwoId: string): Promise<Friend | undefined>;
}
