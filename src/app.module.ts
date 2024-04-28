import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { UserModule } from './api/v1/user/user.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { EventsModule } from './api/v1/events/events.module';
import { HATEOASModule } from './api/v1/HATEOASModule/HATEOAS.module';

import { User } from './api/v1/user/user.entity';

import {
  dbConfig,
  generalConfig,
  authConfig,
  cacheConfig,
  thirdPartyConfig,
} from 'config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './api/v1/common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      load: [
        generalConfig,
        dbConfig,
        authConfig,
        thirdPartyConfig,
        cacheConfig,
      ],
      cache: true,
      expandVariables: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    HATEOASModule,
    EventsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
