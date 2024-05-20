import { Entity, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Friend extends BaseEntity {
	@ManyToOne(() => User, { createForeignKeyConstraints: false })
	@JoinColumn()
	sender: User;

	@ManyToOne(() => User, { createForeignKeyConstraints: false })
	@JoinColumn()
	receiver: User;
}
