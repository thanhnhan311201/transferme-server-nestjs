import { ServerOptions, Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';

import { AuthService } from '@modules/auth/auth.service';
import { AuthModule } from '@modules/auth/auth.module';

import { handshakeAuthMiddleware } from './middlewares/socket-handshake.middleware';

export class WSIoAdapter extends IoAdapter {
	private readonly logger = new Logger(WSIoAdapter.name);
	private authService: AuthService;

	constructor(private app: INestApplicationContext) {
		super(app);
		this.authService = app.select(AuthModule).get(AuthService);
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const cors = {
			origin: process.env.BASE_URL_CLIENT,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		};

		// this.logger.log(`Configuring SocketIO server with CORS options: `, {
		//   cors,
		// });
		// this.logger.log(`Configuring SocketIO server with port: `, { port });

		const optionsWithCORS: ServerOptions = {
			...options,
			cors,
		};

		const server: Server = super.createIOServer(port, optionsWithCORS);

		server.use(handshakeAuthMiddleware(this.authService, this.logger));

		return server;
	}
}
