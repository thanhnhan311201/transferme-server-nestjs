import { Module } from '@nestjs/common';

import { EventsGateway } from './events.gateway';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
	imports: [AuthModule],
	providers: [EventsGateway],
})
export class EventsModule {}
