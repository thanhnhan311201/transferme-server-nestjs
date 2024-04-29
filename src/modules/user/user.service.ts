import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

import { CreateUser } from './types';
import IConfig, { IGeneralConfig } from 'src/config';

@Injectable({})
export class UserService {
	constructor(
		// eslint-disable-next-line no-unused-vars
		@InjectRepository(User) private userRepo: Repository<User>,
		// eslint-disable-next-line no-unused-vars
		private cfgService: ConfigService<IConfig>,
	) {}

	create(data: CreateUser) {
		const user = this.userRepo.create({
			email: data.email,
			password: data.password,
			username: data.username,
			profile_photo:
				data.profilePhoto ||
				`${this.cfgService.get<IGeneralConfig>('general').baseUrlServer}/images/user.png`,
			provider: data.provider || 'transferme',
			friend_list: '',
		});

		return this.userRepo.save(user);
	}

	findOne(id: number) {
		if (!id) {
			return null;
		}

		return this.userRepo.findOneBy({ id });
	}

	find(email: string) {
		return this.userRepo.find({ where: { email } });
	}

	async update(id: number, attributes: Partial<User>) {
		const user = await this.findOne(id);

		if (!user) {
			throw new NotFoundException('User not found!');
		}

		Object.assign(user, attributes);
		return this.userRepo.save(user);
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found!');
		}

		return this.userRepo.remove(user);
	}
}
