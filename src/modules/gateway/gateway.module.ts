import { Module } from '@nestjs/common';

import { TransferringGateway } from './gateway.gateway';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
	imports: [AuthModule],
	providers: [TransferringGateway],
})
export class EventsModule {}
