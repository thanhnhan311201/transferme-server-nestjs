// const dbConfig = {
//   synchronize: false,
//   migrations: ['migrations/*.js'],
//   cli: {
//     migrationsDir: 'migrations',
//   },
// };

// switch (process.env.NODE_ENV) {
//   case 'development':
//     Object.assign(dbConfig, {
//       type: 'sqlite',
//       database: 'db.sqlite',
//       entities: ['**/*.entity.js'],
//     });
//     break;
//   case 'test':
//     Object.assign(dbConfig, {
//       type: 'sqlite',
//       database: 'test.sqlite',
//       entities: ['**/*.entity.ts'],
//       migrationsRun: true,
//     });
//     break;
//   case 'production':
//     Object.assign(dbConfig, {
//       type: 'postgres',
//       url: process.env.DATABASE_URL,
//       migrationsRun: true,
//       entities: ['**/*.entity.js'],
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     });
//     break;
//   default:
//     throw new Error('unknown environment');
// }

const dbConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['**/*.entity.{ts,js}'],
  synchronize: true,
};

module.exports = dbConfig;
