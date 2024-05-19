import { Expose } from 'class-transformer';
import { FRIENDSHIP_STATUS } from '../types';
import { BaseDto } from '@modules/common/base/base.dto';

export class FriendshipDto extends BaseDto {
	@Expose()
	id: string;

	@Expose()
	status: FRIENDSHIP_STATUS;
}
