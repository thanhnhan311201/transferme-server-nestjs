import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

import { TRANSFER_STATUS } from '@modules/transfer/types';

@Entity()
export class Transfer extends BaseEntity {
	@ManyToOne(() => User, (user) => user.transfersSent, { onDelete: 'SET NULL' })
	@JoinColumn()
	sender: User;

	@ManyToOne(() => User, (user) => user.transfersReceived, {
		onDelete: 'SET NULL',
	})
	@JoinColumn()
	receiver: User;

	@Column()
	fileName: string;

	@Column()
	timestamp: Date;

	@Column({
		type: 'enum',
		enum: TRANSFER_STATUS,
		name: 'transfer_status',
	})
	status: TRANSFER_STATUS;
}
