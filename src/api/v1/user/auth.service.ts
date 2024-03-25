import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UserService } from './user.service';

const scrypt = promisify(_scrypt);

@Injectable({})
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
  ) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists.');
    }

    // compare password and confirm password
    if (password !== confirmPassword) {
      throw new BadRequestException('Confirm password has to match.');
    }

    // Hash the user password
    // Generate salt
    const salt = randomBytes(8).toString('hex');

    // hash and salt and the password togerther
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.create({
      email: email,
      password: result,
      username: username,
    });

    return { statusCode: 'success', data: { user } };
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const [salt, storeHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storeHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password.');
    }

    return { statusCode: 'success', data: { user } };
  }
}
