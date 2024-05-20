import { User } from '@configs/typeorm';
import { UserDto } from '../dtos';
import { CreateUser } from '../types';

export interface IUserService {
	create(payload: CreateUser): Promise<UserDto>;
	findOne(id: string): Promise<UserDto>;
	find(email: string): Promise<UserDto[]>;
	update(id: string, attributes: Partial<User>): Promise<UserDto>;
	remove(id: string): Promise<UserDto>;
	authenticateUser(email: string, password: string): Promise<UserDto>;
}
