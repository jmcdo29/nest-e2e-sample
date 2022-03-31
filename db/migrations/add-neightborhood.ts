import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db);
  await sql`CREATE TYPE location AS ENUM ('N', 'S', 'E', 'W');`.execute(db);
  await sql`CREATE TYPE family_role AS ENUM ('guardian', 'adult', 'child')`.execute(
    db,
  );
  await db.schema
    .createTable('neighborhood')
    .addColumn('id', 'uuid', (col) =>
      col
        .notNull()
        .primaryKey()
        .defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('location', sql`location`)
    .execute();
  await db.schema
    .createTable('family')
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('id', 'uuid', (col) =>
      col
        .notNull()
        .primaryKey()
        .defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn('neighborhood_id', 'uuid', (col) =>
      col.notNull().references('neighborhood.id'),
    )
    .execute();
  await db.schema
    .createTable('person')
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('id', 'uuid', (col) =>
      col
        .notNull()
        .primaryKey()
        .defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn('family_id', 'uuid', (col) =>
      col.notNull().references('family.id'),
    )
    .addColumn('role', sql`family_role`, (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('person').execute();
  await db.schema.dropTable('family').execute();
  await db.schema.dropTable('neighborhood').execute();
  await sql`DROP TYPE family_role;`.execute(db);
  await sql`DROP TYPE location;`.execute(db);
  await sql`DROP EXTENSION "uuid-ossp";`.execute(db);
}
