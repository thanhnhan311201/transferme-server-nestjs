import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

import { User } from '@modules/User/user.entity';
import { TRANSFER_STATUS } from './types';

@Entity()
export class Transfer {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@ManyToOne(() => User)
	@JoinColumn()
	sender: User;

	@ManyToOne(() => User)
	@JoinColumn()
	receiver: User;

	@Column()
	fileName: string;

	@Column()
	timestamp: Date;

	@Column({
		type: 'enum',
		enum: TRANSFER_STATUS,
	})
	status: TRANSFER_STATUS;
}
