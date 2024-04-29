import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Friendship } from './friendship.entity';

import IConfig from 'src/config';

@Injectable({})
export class FriendshipService {
	constructor(
		@InjectRepository(Friendship)
		private friendshipRepo: Repository<Friendship>,
		private cfgService: ConfigService<IConfig>,
	) {}
}
