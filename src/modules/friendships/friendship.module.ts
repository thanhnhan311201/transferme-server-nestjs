import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friendship } from '@configs/typeorm';
import { FriendshipService } from './friendship.service';
import { UserModule } from '@modules/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Friendship]),
		forwardRef(() => UserModule),
	],
	providers: [FriendshipService],
	exports: [FriendshipService],
})
export class FriendshipModule {}
