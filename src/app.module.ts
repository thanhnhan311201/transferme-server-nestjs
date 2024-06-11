import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { join } from 'path';

import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { GateWayModule } from '@modules/gateway/gateway.module';
import { HATEOASModule } from '@modules/hateoas/hateoas.module';
import { TransferModule } from '@modules/transfer/transfer.module';
import { FriendModule } from '@modules/friend/friend.module';
import { FriendRequestModule } from '@modules/friend-request/friend-request.module';
import { EventModule } from '@modules/event/event.module';
import { JwtAuthGuard } from '@modules/common/guards';

import rootConfig from '@configs/env/';
import { entities } from '@configs/typeorm';

@Module({
	imports: [
		ConfigModule.forRoot(rootConfig),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client'),
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRES_PORT),
			database: process.env.POSTGRES_DB,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			entities: entities,
			synchronize: true, // does not allow in production, have to migrate database
			// logging: 'all',
		}),
		UserModule,
		AuthModule,
		HATEOASModule,
		GateWayModule,
		TransferModule,
		FriendModule,
		FriendRequestModule,
		EventEmitterModule.forRoot(),
		EventModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
