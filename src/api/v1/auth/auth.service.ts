import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { map, catchError, lastValueFrom } from 'rxjs';

import { UserService } from '../user/user.service';
import { CreateUserDto, FacebookLoginDto, SigninDto } from './dtos';

import { JwtPayload, Tokens } from './types';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import { RefreshTokenStorage } from './helpers/refresh-token-storage';
import { GoogleAuthClient } from './helpers/google-auth-client';

import { genRandomString } from 'src/utils/helpers.util';
import { HttpService } from '@nestjs/axios';

@Injectable({})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cfgService: ConfigService,
    private refreshTokenStorage: RefreshTokenStorage,
    private googleAuthClient: GoogleAuthClient,
    private httpService: HttpService,
  ) {}

  async genToken(userId: number, email: string): Promise<Tokens> {
    const jwtPayload = { sub: userId, email: email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.cfgService.get<string>('auth.SECRET_JWT_KEY'),
        expiresIn: this.cfgService.get<string>(
          'auth.ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.cfgService.get<string>('auth.SECRET_JWT_REFRESH_KEY'),
        expiresIn: this.cfgService.get<string>(
          'auth.REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(payload: CreateUserDto): Promise<User> {
    const users = await this.userService.find(payload.email);
    if (users.length) {
      throw new BadRequestException('Email already exists.');
    }

    // compare password and confirm password
    if (payload.password !== payload.confirmPassword) {
      throw new BadRequestException('Confirm password has to match.');
    }

    // Hash the user password
    const hash = hashSync(payload.password, 12);

    // Create a new user and save it
    const user = await this.userService.create({
      email: payload.email,
      password: hash,
      username: payload.username,
    });

    return user;
  }

  async signin(payload: SigninDto) {
    const [user] = await this.userService.find(payload.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!compareSync(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const { accessToken, refreshToken } = await this.genToken(
      user.id,
      user.email,
    );

    await this.refreshTokenStorage.insert(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  signout(userId: number) {
    return this.refreshTokenStorage.invalidate(userId);
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.cfgService.get<string>('auth.SECRET_JWT_REFRESH_KEY'),
        },
      );

      const user = await this.userService.findOne(decoded.sub);
      if (!user) throw new UnauthorizedException('Invalid refresh token.');

      await this.refreshTokenStorage.validate(decoded.sub, refreshToken);

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.genToken(user.id, user.email);

      await this.refreshTokenStorage.insert(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async verifyEmail(email: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists.');
    }

    return true;
  }

  async googleLogin(authCode: string) {
    const payload = await this.googleAuthClient.verifyAuthToken(authCode);

    let tokens: Tokens;

    const users = await this.userService.find(payload.email);
    if (users.length) {
      const updatedUser = await this.userService.update(users[0].id, {
        email: payload.email,
        username: payload.name,
        profile_photo: payload.picture,
        provider: 'google',
      });

      tokens = await this.genToken(updatedUser.id, updatedUser.email);

      await this.refreshTokenStorage.insert(
        updatedUser.id,
        tokens.refreshToken,
      );
    } else {
      // Hash the user password
      const hash = hashSync(genRandomString(8), 12);

      // Create a new user and save it
      const newUser = await this.userService.create({
        email: payload.email,
        password: hash,
        username: payload.name,
        provider: 'google',
        profilePhoto: payload.picture,
      });

      tokens = await this.genToken(newUser.id, newUser.email);

      await this.refreshTokenStorage.insert(newUser.id, tokens.refreshToken);
    }

    return { ...tokens };
  }

  async githubAuthentication(authCode: string) {
    try {
      const accessTokenRequest = this.httpService
        .post(
          `https://github.com/login/oauth/access_token?client_id=${this.cfgService.get<string>('thirdParty.github.CREDENTIAL_CLIENT_ID')}&client_secret=${this.cfgService.get<string>('thirdParty.github.CREDENTIAL_CLIENT_SECRET')}&code=${authCode}`,
          {},
          {
            headers: {
              accept: 'application/json',
            },
          },
        )
        .pipe(map((res) => res.data))
        .pipe(
          catchError(() => {
            throw new UnauthorizedException('Invalid github code!');
          }),
        );

      const data = await lastValueFrom(accessTokenRequest);
      const { access_token: accessToken } = data;
      if (!accessToken) {
        throw new UnauthorizedException('Invalid github code!');
      }

      const userInfoRequest = this.httpService
        .get(`https://api.github.com/user`, {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        })
        .pipe(map((res) => res.data))
        .pipe(
          catchError(() => {
            throw new UnauthorizedException('Invalid github code!');
          }),
        );

      const gitUser = await lastValueFrom(userInfoRequest);

      let tokens: Tokens;

      const users = await this.userService.find(`${gitUser.login}@git.com`);
      if (users.length) {
        const updatedUser = await this.userService.update(users[0].id, {
          email: `${gitUser.login}@git.com`,
          username: gitUser.login,
          profile_photo: gitUser.avatar_url,
          provider: 'github',
        });

        tokens = await this.genToken(updatedUser.id, updatedUser.email);

        await this.refreshTokenStorage.insert(
          updatedUser.id,
          tokens.refreshToken,
        );
      } else {
        // Hash the user password
        const hash = hashSync(genRandomString(8), 12);

        // Create a new user and save it
        const newUser = await this.userService.create({
          email: `${gitUser.login}@git.com`,
          password: hash,
          username: gitUser.login,
          provider: 'github',
          profilePhoto: gitUser.avatar_url,
        });

        tokens = await this.genToken(newUser.id, newUser.email);

        await this.refreshTokenStorage.insert(newUser.id, tokens.refreshToken);
      }

      return { ...tokens };
    } catch (error) {
      throw new UnauthorizedException('Invalid github code!');
    }
  }

  async facebookLogin(payload: FacebookLoginDto) {
    let tokens: Tokens;

    const users = await this.userService.find(
      payload.email.split('@')[0] + '@facebook.com',
    );
    if (users.length) {
      const updatedUser = await this.userService.update(users[0].id, {
        email: payload.email.split('@')[0] + '@facebook.com',
        username: payload.username,
        profile_photo: payload.profilePhoto,
        provider: 'facebook',
      });

      tokens = await this.genToken(updatedUser.id, updatedUser.email);

      await this.refreshTokenStorage.insert(
        updatedUser.id,
        tokens.refreshToken,
      );
    } else {
      // Hash the user password
      const hash = hashSync(genRandomString(8), 12);

      // Create a new user and save it
      const newUser = await this.userService.create({
        email: payload.email,
        password: hash,
        username: payload.username,
        provider: 'facebook',
        profilePhoto: payload.profilePhoto,
      });

      tokens = await this.genToken(newUser.id, newUser.email);

      await this.refreshTokenStorage.insert(newUser.id, tokens.refreshToken);
    }

    return { ...tokens };
  }
}
