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
	FRIEND_REQUEST_CREATE = 'friendrequest:create',
	FRIEND_REQUEST_ACCEPTED = 'friendrequest:accepted',
	FRIEND_REQUEST_REJECTED = 'friendrequest:rejected',
	FRIEND_REQUEST_CANCELLED = 'friendrequest:cancelled',
	FRIEND_REQUEST_CANCEL = 'friendrequest:cancel',
	FRIEND_REMOVED = 'friend:removed',
}

export enum SOCKET_EVENTS {
	// general
	NEW_CONNECTION = 'new_connection',
	SIGNOUT = 'signout',

	// Transfer
	TRANSFER_SEND_FILE = 'transfer:send_file',
	TRANSFER_WAIT_TRANSFER_ACCEPTED = 'transfer:wait_transfer_accepted',
	TRANSFER_SUCCESS_TRANSFER = 'transfer:success_transfer',
	TRANSFER_ERROR_TRANSFER = 'transfer:error_transfer',
	TRANSFER_CANCEL_TRANSFER = 'transfer:cancel_transfer',
	TRANSFER_ON_CANCEL_TRANSFER = 'transfer:on_cancel_transfer',
	TRANSFER_REQUEST_SEND_FILE = 'transfer:request_send_file',
	TRANSFER_REPLY_TO_REQUEST = 'transfer:reply_to_request',
	TRANSFER_REFUSE_REQUEST = 'transfer:refuse_request',
	TRANSFER_ACCEPT_REQUEST = 'transfer:accept_request',
	TRANSFER_RECEIVE_FILE = 'transfer:receive_file',
	TRANSFER_ACK_RECEIVE_FILE = 'transfer:ack_receive_file',
	TRANSFER_ON_ACK_RECEIVE_FILE = 'transfer:on_ack_receive_file',

	// Friend
	FRIEND_REQUEST_ACCEPTED = 'friend:request_accepted',
	FRIEND_REQUEST_REJECTED = 'friend:request_rejected',
}
