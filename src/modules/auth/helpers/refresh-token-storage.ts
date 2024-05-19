import {
	Injectable,
	OnApplicationBootstrap,
	OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

import { IConfig, ICacheConfig } from '@configs/env';

export class InvalidatedRefreshTokenError extends Error {}

export interface IRefreshTokenStorage {
	insert(userId: string, token: string): Promise<void>;
	validate(userId: string, token: string): Promise<boolean>;
	invalidate(userId: string): Promise<void>;
}

@Injectable()
export class RefreshTokenStorage
	implements
		OnApplicationBootstrap,
		OnApplicationShutdown,
		IRefreshTokenStorage
{
	private redisClient: Redis;

	constructor(private cfgService: ConfigService<IConfig>) {}

	onApplicationBootstrap() {
		this.redisClient = new Redis({
			host: this.cfgService.get<ICacheConfig>('redis').redisHost,
			port: this.cfgService.get<ICacheConfig>('redis').redisPort,
			family: 6,
		});
	}

	onApplicationShutdown() {
		return this.redisClient.quit();
	}

	async insert(userId: string, token: string): Promise<void> {
		await this.redisClient.set(
			this.getKey(userId),
			token,
			'EX',
			this.cfgService.get<ICacheConfig>('redis').refreshTokenTokenExpTime,
		);
	}

	async validate(userId: string, token: string): Promise<boolean> {
		const storedToken = await this.redisClient.get(this.getKey(userId));
		if (!storedToken || storedToken !== token) {
			throw new InvalidatedRefreshTokenError();
		}
		return storedToken === token;
	}

	async invalidate(userId: string): Promise<void> {
		await this.redisClient.del(this.getKey(userId));
	}

	private getKey(userId: string): string {
		return `user-${userId}`;
	}
}
