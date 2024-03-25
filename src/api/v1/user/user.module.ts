import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
