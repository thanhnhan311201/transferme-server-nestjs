import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  user_name: string;

  @Column()
  profile_photo: string;

  @Column()
  friend_list: string;

  @Column()
  create_with: string;
}
