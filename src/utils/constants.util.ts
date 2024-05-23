export enum SERVICES {
	AUTH_SERVICE = 'AUTH_SERVICE',
	USER_SERVICE = 'USER_SERVICE',
	FRIEND_SERVICE = 'FRIEND_SERVICE',
	FRIEND_REQUEST_SERVICE = 'FRIEND_REQUEST_SERVICE',
	GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER',
	GOOGLE_AUTH_CLIENT = 'GOOGLE_AUTH_CLIENT',
	REFRESH_TOKEN_STORAGE = 'REFRESH_TOKEN_STORAGE',
}

export enum ROUTES {
	AUTH = 'auth',
	USER = 'user',
	FRIEND = 'friend',
	TRANSFER = 'transfer',
	FRIEND_REQUEST = 'friend-request',
}

export enum SERVER_EVENTS {
	FRIEND_REQUEST_CREATE = 'friendrequest.create',
	FRIEND_REQUEST_ACCEPTED = 'friendrequest.accepted',
	FRIEND_REQUEST_REJECTED = 'friendrequest.rejected',
	FRIEND_REQUEST_CANCELLED = 'friendrequest.cancelled',
	FRIEND_REQUEST_CANCEL = 'friendrequest.cancel',
	FRIEND_REMOVED = 'friend.removed',
}

export enum SOCKET_EVENTS {
	// general
	ON_RECEIVE_NEW_CONNECTION = 'onReceiveNewConnection',
	ON_LOGGED_OUT = 'onLoggedOut',

	// Transfer
	// SEND_FILE = 'onSendFile',
	// WAIT_TRANSFER_ACCEPTED = 'onWaitTransferringAccepted',
	// SUCCESS_TRANSFER = 'onTransferSuccessfully',
	// ERROR_TRANSFER = 'onTransferFailed',
	// CANCEL_TRANSFER = 'onCancelTransfer',
	// ON_CANCEL_TRANSFER = 'ON_CANCEL_TRANSFER',
	// NEW_CONNECTION = 'onNewConnection',
	// USER_LOGGED_OUT = 'onUserLoggedOut',
	// REQUEST_SEND_FILE = 'REQUEST_SEND_FILE',
	// REPLY_TO_REQUEST = 'onReplyToRequest',
	// REFUSE_REQUEST = 'onRefuseRequest',
	// ACCEPT_REQUEST = 'onAcceptRequest',
	// RECEIVE_FILE = 'onReceiveFile',
	// ACK_RECEIVE_FILE = 'ACK_RECEIVE_FILE',
	// ON_ACK_RECEIVE_FILE = 'ON_ACK_RECEIVE_FILE',

	// Friend
	FRIEND_REQUEST_ACCEPTED = 'onAcceptedFriendRequest',
	FRIEND_REQUEST_REJECTED = 'onRejectedFriendRequest',
}
