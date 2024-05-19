import { ForbiddenException, Logger } from '@nestjs/common';

import { AuthService } from '@modules/auth/auth.service';

import { SocketWithAuth } from '../types/auth.type';
import { genRandomString } from '@utils/helpers.util';
import { socketRecord } from '../utils/';

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

			const usernameEmail =
				user.email.split('@')[0].length > 15
					? user.email.split('@')[0].slice(0, 15)
					: user.email.split('@')[0];
			let clientId: string = `${usernameEmail}@${genRandomString(5)}`;
			const clientIds = Array.from(socketRecord.keys());
			while (true) {
				if (!clientIds.includes(clientId)) {
					break;
				}

				clientId = `${usernameEmail}@${genRandomString(5)}`;
			}

			socket.user = {
				id: user.id,
				email: user.email,
				username: user.username,
				profilePhoto: user.profilePhoto,
			};
			socket.clientId = clientId;
			socket.roomId = user.id;

			socketRecord.set(socket.clientId, socket.id);

			next();
		} catch {
			throw new ForbiddenException();
		}
	};
