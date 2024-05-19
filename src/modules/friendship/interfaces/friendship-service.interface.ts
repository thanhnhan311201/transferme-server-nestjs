export interface IFriendshipService {
	createFriendRequest(payload: {
		senderId: string;
		recipientId: string;
	}): Promise<boolean>;
}
