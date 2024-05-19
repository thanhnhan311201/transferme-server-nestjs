import { Module } from '@nestjs/common';

import { TransferringGateway } from './gateway.gateway';
import { GatewaySessionManager } from './gateway.session';
import { AuthModule } from '@modules/auth/auth.module';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [AuthModule],
	providers: [
		TransferringGateway,
		{
			provide: SERVICES.GATEWAY_SESSION_MANAGER,
			useClass: GatewaySessionManager,
		},
	],
	exports: [
		TransferringGateway,
		{
			provide: SERVICES.GATEWAY_SESSION_MANAGER,
			useClass: GatewaySessionManager,
		},
	],
})
export class GateWayModule {}
