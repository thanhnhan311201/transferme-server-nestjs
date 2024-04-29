import { Expose } from 'class-transformer';

export class UserDto {
	@Expose()
	id: number;

	@Expose()
	email: string;

	@Expose()
	username: string;

	@Expose()
	profilePhoto: string;

	@Expose()
	fiendList: string;
}
