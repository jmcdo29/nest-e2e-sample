import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import { join } from 'path';

const dbByEnv = {
  development: {
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
    port: 25432,
  },
  test: {
    host: 'localhost',
    database: 'test',
    user: 'postgres',
    password: 'postgres',
    port: 35432,
  },
};
async function migrate() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect(
      dbByEnv[process.env.NODE_ENV ?? 'development'],
    ),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider(
      // Path to the folder that contains all your migrations.
      join(__dirname, 'migrations'),
    ),
  });
  const migrationMethod: 'migrateToLatest' | 'migrateDown' =
    process.argv[process.argv.length - 1] === 'down'
      ? 'migrateDown'
      : 'migrateToLatest';
  const { error, results } = await migrator[migrationMethod]();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrate();
