import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

import { User } from '@modules/User/user.entity';

import { FRIENDSHIP_STATUS } from '@modules/Friendship/types';

@Entity()
export class Friendship {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@ManyToOne(() => User, (user) => user.friendships)
	@JoinColumn()
	user: User;

	@ManyToOne(() => User)
	@JoinColumn()
	friend: User;

	@Column({
		type: 'enum',
		enum: FRIENDSHIP_STATUS,
		default: FRIENDSHIP_STATUS.PENDING,
	})
	status: FRIENDSHIP_STATUS;
}
