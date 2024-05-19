import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friendship } from '@configs/typeorm';
import { FriendshipService } from './friendship.service';
import { UserModule } from '@modules/user/user.module';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [
		TypeOrmModule.forFeature([Friendship]),
		forwardRef(() => UserModule),
	],
	providers: [
		{
			provide: SERVICES.FRIENDSHIP_SERVICE,
			useClass: FriendshipService,
		},
	],
	exports: [
		{
			provide: SERVICES.FRIENDSHIP_SERVICE,
			useClass: FriendshipService,
		},
	],
})
export class FriendshipModule {}
