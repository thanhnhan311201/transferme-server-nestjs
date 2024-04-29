import { Module } from '@nestjs/common';

import { HATEOASController } from './HATEOAS.controller';

@Module({
	controllers: [HATEOASController],
})
export class HATEOASModule {}
