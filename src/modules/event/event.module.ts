import { Module } from '@nestjs/common';

import { GateWayModule } from '@modules/gateway/gateway.module';
import { FriendRequestEvent } from './friend-request.event';
import { FriendEvent } from './friend.event';

@Module({
	imports: [GateWayModule],
	providers: [FriendRequestEvent, FriendEvent],
})
export class EventModule {}
