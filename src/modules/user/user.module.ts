import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '@modules/User/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
