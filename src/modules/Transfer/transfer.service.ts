import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Transfer } from '@configs/typeorm';

import { IConfig } from '@configs/env';

@Injectable({})
export class TransferpService {
	constructor(
		@InjectRepository(Transfer)
		private transferRepo: Repository<Transfer>,
		private cfgService: ConfigService<IConfig>,
	) {}
}
