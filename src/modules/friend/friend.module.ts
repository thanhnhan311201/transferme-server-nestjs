import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friend } from '@configs/typeorm';
import { FriendService } from './friend.service';

import { SERVICES } from '@utils/constants.util';
import { FriendController } from './friend.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Friend])],
	providers: [
		{
			provide: SERVICES.FRIEND_SERVICE,
			useClass: FriendService,
		},
	],
	controllers: [FriendController],
	exports: [
		{
			provide: SERVICES.FRIEND_SERVICE,
			useClass: FriendService,
		},
	],
})
export class FriendModule {}
