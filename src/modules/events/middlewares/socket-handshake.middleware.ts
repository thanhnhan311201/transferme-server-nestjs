/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenException, Logger } from '@nestjs/common';

import { AuthService } from '@modules/auth/auth.service';

import { SocketWithAuth } from '../types/auth.type';

export const handshakeAuthMiddleware =
	(authService: AuthService, logger: Logger) =>
	async (socket: SocketWithAuth, next) => {
		const token =
			socket.handshake.auth.token || socket.handshake.headers['token'];
		logger.debug(`Validating auth token before connection: ${token}`);

		if (!token) {
			throw new ForbiddenException();
		}

		try {
			const user = await authService.verifyAccessToken(token);

			socket.user = {
				id: user.id,
				email: user.email,
				username: user.username,
				picture: user.profile_photo,
				friendList: user.friend_list,
			};
			socket.clientId = '';
			socket.roomId = user.id;

			next();
		} catch {
			throw new ForbiddenException();
		}
	};
