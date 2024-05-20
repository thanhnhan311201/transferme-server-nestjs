import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '@configs/typeorm/entities/user.entity';

import { SERVICES } from '@utils/constants.util';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController],
	providers: [
		{
			provide: SERVICES.USER_SERVICE,
			useClass: UserService,
		},
	],
	exports: [
		{
			provide: SERVICES.USER_SERVICE,
			useClass: UserService,
		},
	],
})
export class UserModule {}
