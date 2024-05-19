import { Module } from '@nestjs/common';

import { HATEOASController } from './hateoas.controller';

@Module({
	controllers: [HATEOASController],
})
export class HATEOASModule {}
