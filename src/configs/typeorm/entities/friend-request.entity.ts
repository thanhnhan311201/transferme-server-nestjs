import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

import { FRIEND_REQUEST_STATUS } from '@modules/friend-request/types';

@Entity()
export class FriendRequest extends BaseEntity {
	@ManyToOne(() => User, { createForeignKeyConstraints: false })
	@JoinColumn()
	sender: User;

	@ManyToOne(() => User, { createForeignKeyConstraints: false })
	@JoinColumn()
	receiver: User;

	@Column({
		type: 'enum',
		enum: FRIEND_REQUEST_STATUS,
		default: FRIEND_REQUEST_STATUS.PENDING,
		name: 'friend_request_status',
	})
	status: FRIEND_REQUEST_STATUS;
}
