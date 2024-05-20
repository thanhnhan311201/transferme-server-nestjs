import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Friend } from './entities/friend.entity';
import { Transfer } from './entities/transfer.entity';
import { User } from './entities/user.entity';
import { FriendRequest } from './entities/friend-request.entity';

dotenvConfig({
	path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
});

export const entities = [Friend, Transfer, User, FriendRequest];
const ormConfig = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: entities,
	synchronize: true, // shouldn't use in production
};
const connectionSource = new DataSource(ormConfig as DataSourceOptions);

export { Friend, Transfer, User, FriendRequest };
export default connectionSource;
