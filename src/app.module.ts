import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { UserModule } from '@modules/User/user.module';
import { AuthModule } from '@modules/Auth/auth.module';
import { EventsModule } from '@modules/Events/events.module';
import { HATEOASModule } from '@modules/HATEOAS/HATEOAS.module';
import { TransferModule } from '@modules/Transfer/transfer.module';
import { FriendshipModule } from '@modules/Friendship/friendship.module';

import { JwtAuthGuard } from '@modules/Common/guards';

import {
	generalConfig,
	authConfig,
	cacheConfig,
	thirdPartyConfig,
} from './config';

import { APP_GUARD } from '@nestjs/core';
import { User } from '@modules/User/user.entity';
import { Friendship } from '@modules/Friendship/friendship.entity';
import { Transfer } from '@modules/Transfer/transfer.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			load: [generalConfig, authConfig, thirdPartyConfig, cacheConfig],
			cache: true,
			expandVariables: true,
		}),
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
			entities: [User, Friendship, Transfer],
			synchronize: true, // does not allow in production, have to migrate database
			autoLoadEntities: true,
		}),
		UserModule,
		AuthModule,
		HATEOASModule,
		EventsModule,
		TransferModule,
		FriendshipModule,
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
