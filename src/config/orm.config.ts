import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Friendship } from '@modules/Friendship/friendship.entity';
import { Transfer } from '@modules/Transfer/transfer.entity';
import { User } from '@modules/User/user.entity';

dotenvConfig({
	path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
});

const config = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [User, Transfer, Friendship],
	migrations: [join(__dirname, '/../migrations/*{.ts,.js}')],
	autoLoadEntities: true,
	synchronize: false,
};

export const ormConfig = () => ({
	orm: config,
});

export const connectionSource = new DataSource(config as DataSourceOptions);
