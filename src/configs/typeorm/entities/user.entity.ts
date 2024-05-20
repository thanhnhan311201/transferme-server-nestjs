import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Transfer } from './transfer.entity';

import { PROVIDER } from '@modules/user/types';

@Entity()
export class User extends BaseEntity {
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	username: string;

	@Column({
		name: 'profile_photo',
	})
	profilePhoto: string;

	@Column({ default: false })
	isOnline: boolean;

	@OneToMany(() => Transfer, (transfer) => transfer.sender)
	transfersSent: Transfer[];

	@OneToMany(() => Transfer, (transfer) => transfer.receiver)
	transfersReceived: Transfer[];

	@Column({
		type: 'enum',
		enum: PROVIDER,
		default: PROVIDER.TRANSFERME,
	})
	provider: PROVIDER;
}
