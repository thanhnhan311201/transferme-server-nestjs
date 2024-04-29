import { Friendship } from '@modules/Friendship/friendship.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

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

	@Column()
	provider: string;
}
