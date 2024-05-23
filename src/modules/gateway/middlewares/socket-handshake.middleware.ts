import { ForbiddenException, Logger } from '@nestjs/common';

import { AuthenticatedSocket } from '../types/auth.type';
import { IGatewaySessionManager } from '../gateway.session';

import { IAuthService } from '@modules/auth/interfaces';

import { genRandomString } from '@utils/helpers.util';

export const handshakeAuthMiddleware =
	(
		authService: IAuthService,
		logger: Logger,
		gatewaySessionManager: IGatewaySessionManager,
	) =>
	async (socket: AuthenticatedSocket, next) => {
		const token =
			socket.handshake.auth.token || socket.handshake.headers['token'];
		logger.debug(`Validating auth token before connection: ${token}`);

		if (!token) {
			return next(new ForbiddenException());
		}

		try {
			const user = await authService.verifyAccessToken(token);

			const usernameEmail =
				user.email.split('@')[0].length > 15
					? user.email.split('@')[0].slice(0, 15)
					: user.email.split('@')[0];
			let clientId: string = `${usernameEmail}@${genRandomString(5)}`;
			const clientIds = Array.from(gatewaySessionManager.getAllSocketId());
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

			gatewaySessionManager.setUserSocket(socket.clientId, socket);

			next();
		} catch {
			next(new ForbiddenException());
		}
	};
