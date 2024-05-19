import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transfer } from '@configs/typeorm';
import { TransferpService } from './transfer.service';

@Module({
	imports: [TypeOrmModule.forFeature([Transfer])],
	providers: [TransferpService],
	exports: [TransferpService],
})
export class TransferModule {}
