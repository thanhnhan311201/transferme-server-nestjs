import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '@configs/typeorm';

import { CreateUser } from './types';
import { IConfig, IGeneralConfig } from '@configs/env/index';
import { UserDto } from './dtos/user.dto';
import { compareSync } from 'bcryptjs';
import { isEmpty } from 'class-validator';
import { UserWithRelationDto } from './dtos/user-with-relation.dto';
import { IUserService } from './interfaces';

@Injectable({})
export class UserService implements IUserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		private readonly cfgService: ConfigService<IConfig>,
		// private readonly friendshipService: IFriendshipService,
	) {}

	async create(payload: CreateUser): Promise<UserDto> {
		const user = this.userRepo.create({
			email: payload.email,
			password: payload.password,
			username: payload.username,
			profilePhoto:
				payload.profilePhoto ||
				`${this.cfgService.get<IGeneralConfig>('general').baseUrlServer}/images/user.png`,
			provider: payload.provider,
		});
		const savedUser = await this.userRepo.save(user);

		return UserDto.mapToDto(savedUser);
	}

	async findOne(id: string): Promise<UserDto> {
		if (!id) {
			return null;
		}

		const user = await this.userRepo.findOneBy({ id });

		return UserDto.mapToDto(user);
	}

	async find(email: string): Promise<UserDto[]> {
		const users = await this.userRepo.find({ where: { email } });

		return users.map((user) => UserDto.mapToDto(user));
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

		return UserDto.mapToDto(savedUser);
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

		return UserDto.mapToDto(removedUser);
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

		return UserDto.mapToDto(user);
	}

	async getUserInfoWithRelation(userId: string): Promise<UserWithRelationDto> {
		if (!userId) {
			return null;
		}

		const user = await this.userRepo
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.friendships', 'friendship')
			.leftJoinAndSelect('user.friendshipsAsFriend', 'friendshipsAsFriend')
			.leftJoinAndSelect('user.transfersSent', 'transfersSent')
			.leftJoinAndSelect('user.transfersReceived', 'transfersReceived')
			.where('user.id = :userId', { userId })
			.getOne();

		if (!user) {
			throw new NotFoundException('User not found!');
		}

		return UserWithRelationDto.mapToDto(user);
	}
}
