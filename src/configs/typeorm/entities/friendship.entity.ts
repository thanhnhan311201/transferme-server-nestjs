import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

import { FRIENDSHIP_STATUS } from '@modules/friendship/types';

@Entity()
export class Friendship extends BaseEntity {
	@ManyToOne(() => User, (user) => user.friendships, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;

	@ManyToOne(() => User, (user) => user.friendshipsAsFriend, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	friend: User;

	@Column({
		type: 'enum',
		enum: FRIENDSHIP_STATUS,
		default: FRIENDSHIP_STATUS.PENDING,
		name: 'friendship_status',
	})
	status: FRIENDSHIP_STATUS;
}
