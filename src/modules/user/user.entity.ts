import { Friendship } from '@modules/Friendship/friendship.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PROVIDER } from './types';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column()
	username: string;

	@Column()
	profile_photo: string;

	@OneToMany(() => Friendship, (friendShip) => friendShip.user)
	friendships: Friendship[];

	@Column({
		type: 'enum',
		enum: PROVIDER,
		default: PROVIDER.TRANSFERME,
	})
	provider: PROVIDER;
}
