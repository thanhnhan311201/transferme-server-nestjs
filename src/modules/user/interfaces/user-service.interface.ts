import { User } from '@configs/typeorm';
import { UserDto } from '../dtos';
import { CreateUser } from '../types';
import { UserWithRelationDto } from '../dtos/user-with-relation.dto';

export interface IUserService {
	create(payload: CreateUser): Promise<UserDto>;
	findOne(id: string): Promise<UserDto>;
	find(email: string): Promise<UserDto[]>;
	update(id: string, attributes: Partial<User>): Promise<UserDto>;
	remove(id: string): Promise<UserDto>;
	authenticateUser(email: string, password: string): Promise<UserDto>;
	getUserInfoWithRelation(userId: string): Promise<UserWithRelationDto>;
}
