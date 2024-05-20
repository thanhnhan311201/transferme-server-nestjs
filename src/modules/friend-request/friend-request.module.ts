import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friend, FriendRequest } from '@configs/typeorm';
import { FriendRequestService } from './friend-request.service';
import { UserModule } from '@modules/user/user.module';

import { SERVICES } from '@utils/constants.util';
import { FriendModule } from '@modules/friend/friend.module';
import { FriendRequestController } from './friend-request.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Friend, FriendRequest]),
		UserModule,
		FriendModule,
	],
	controllers: [FriendRequestController],
	providers: [
		{
			provide: SERVICES.FRIEND_REQUEST_SERVICE,
			useClass: FriendRequestService,
		},
	],
})
export class FriendRequestModule {}
