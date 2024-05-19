import { Expose, Transform, instanceToPlain } from 'class-transformer';
import { PROVIDER } from '../types';
import { Friendship } from '@configs/typeorm/entities/friendship.entity';
import { Transfer } from '@configs/typeorm/entities/transfer.entity';
import { BaseDto } from '@modules/common/base/base.dto';

export class UserWithRelationDto extends BaseDto {
	@Expose()
	id: string;

	@Expose()
	email: string;

	@Expose()
	username: string;

	@Expose()
	profilePhoto: string;

	@Expose()
	provider: PROVIDER;

	@Transform(({ obj }) =>
		obj.friendships.map((friendship: any) => instanceToPlain(friendship)),
	)
	@Expose()
	friendships: Friendship[];

	@Transform(({ obj }) =>
		obj.friendshipsAsFriend.map((friendshipAsFriend: any) =>
			instanceToPlain(friendshipAsFriend),
		),
	)
	@Expose()
	friendshipsAsFriend: Friendship[];

	@Expose()
	transfersSent: Transfer[];

	@Expose()
	transfersReceived: Transfer[];
}
