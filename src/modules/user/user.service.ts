import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@modules/User/user.entity';

import { CreateUser } from './types';
import IConfig, { IGeneralConfig } from 'src/config';
import { UserDto } from './dtos/user.dto';
import { plainToInstance } from 'class-transformer';
import { compareSync } from 'bcryptjs';
import { isEmpty } from 'class-validator';

@Injectable({})
export class UserService {
	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		private cfgService: ConfigService<IConfig>,
	) {}

	async create(data: CreateUser): Promise<UserDto> {
		const user = this.userRepo.create({
			email: data.email,
			password: data.password,
			username: data.username,
			profile_photo:
				data.profilePhoto ||
				`${this.cfgService.get<IGeneralConfig>('general').baseUrlServer}/images/user.png`,
			provider: data.provider,
		});
		const savedUser = await this.userRepo.save(user);

		return plainToInstance(UserDto, savedUser, {
			excludeExtraneousValues: true,
		});
	}

	async findOne(id: string): Promise<UserDto> {
		if (!id) {
			return null;
		}

		const user = await this.userRepo.findOneBy({ id });

		return plainToInstance(UserDto, user, {
			excludeExtraneousValues: true,
		});
	}

	async find(email: string): Promise<UserDto[]> {
		const users = await this.userRepo.find({ where: { email } });

		return users.map((user) =>
			plainToInstance(UserDto, user, {
				excludeExtraneousValues: true,
			}),
		);
	}

	async update(id: string, attributes: Partial<User>): Promise<UserDto> {
		if (!id) {
			return null;
		}

		const user = await this.userRepo.findOneBy({ id });

		if (!user) {
			throw new NotFoundException('User not found!');
		}

		Object.assign(user, attributes);
		const savedUser = await this.userRepo.save(user);

		return plainToInstance(UserDto, savedUser, {
			excludeExtraneousValues: true,
		});
	}

	async remove(id: string): Promise<UserDto> {
		if (!id) {
			return null;
		}

		const user = await this.userRepo.findOneBy({ id });
		if (!user) {
			throw new NotFoundException('User not found!');
		}
		const removedUser = await this.userRepo.remove(user);

		return plainToInstance(UserDto, removedUser, {
			excludeExtraneousValues: true,
		});
	}

	async authenticateUser(email: string, password: string): Promise<UserDto> {
		if (!password || !email) {
			throw new UnauthorizedException('Invalid email or password.');
		}

		const users = await this.userRepo.find({ where: { email } });
		if (isEmpty(users)) {
			throw new UnauthorizedException('Invalid email or password.');
		}
		const user = users[0];

		if (!compareSync(password, user.password)) {
			throw new UnauthorizedException('Invalid email or password.');
		}

		return plainToInstance(UserDto, user, {
			excludeExtraneousValues: true,
		});
	}
}
