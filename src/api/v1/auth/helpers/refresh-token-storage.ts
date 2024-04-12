import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  constructor(private cfgService: ConfigService) {}

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: this.cfgService.get<string>('redisHost'),
      port: this.cfgService.get<number>('redisPort'),
      family: 6,
    });
  }

  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  async insert(userId: number, token: string): Promise<void> {
    await this.redisClient.set(
      this.getKey(userId),
      token,
      'EX',
      this.cfgService.get<number>('auth.refreshTokenExpirationTimeForRedis'),
    );
  }

  async validate(userId: number, token: string): Promise<boolean> {
    const storedToken = await this.redisClient.get(this.getKey(userId));
    if (!storedToken || storedToken !== token) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedToken === token;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
