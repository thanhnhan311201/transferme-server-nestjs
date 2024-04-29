import { Expose, Transform } from 'class-transformer';
import { PROVIDER } from '../types';

export class UserDto {
	@Expose()
	id: string;

	@Expose()
	email: string;

	@Expose()
	username: string;

	@Transform(({ obj }) => obj.profile_photo)
	@Expose()
	profilePhoto: string;

	@Expose()
	provider: PROVIDER;
}
