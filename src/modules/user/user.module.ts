import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '@configs/typeorm/entities/user.entity';
import { FriendshipModule } from '@modules/friendship/friendship.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		forwardRef(() => FriendshipModule),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
