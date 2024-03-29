import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

import { ConfigService } from '@nestjs/config';
import { CreateUser } from './types';

@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private cfgService: ConfigService,
  ) {}

  create(data: CreateUser) {
    const user = this.userRepo.create({
      email: data.email,
      password: data.password,
      username: data.username,
      profile_photo:
        data.profilePhoto ||
        `${this.cfgService.get<string>('baseUrlServer')}/images/user.png`,
      create_with: data.createWith || 'transferme',
      friend_list: '',
    });

    return this.userRepo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.userRepo.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepo.find({ where: { email } });
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    Object.assign(user, attributes);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.userRepo.remove(user);
  }
}
