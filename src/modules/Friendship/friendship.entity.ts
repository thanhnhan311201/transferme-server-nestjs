import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

import { User } from '@modules/User/user.entity';

import { FRIENDSHIP_STATUS } from './types';

@Entity()
export class Friendship {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.friendships)
	@JoinColumn()
	user: User;

	@ManyToOne(() => User)
	@JoinColumn()
	friend: User;

	@Column()
	status: FRIENDSHIP_STATUS;
}
