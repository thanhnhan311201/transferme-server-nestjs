import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transfer } from './transfer.entity';
import { TransferpService } from './transfer.service';

@Module({
	imports: [TypeOrmModule.forFeature([Transfer])],
	providers: [TransferpService],
	exports: [TransferpService],
})
export class TransferModule {}
