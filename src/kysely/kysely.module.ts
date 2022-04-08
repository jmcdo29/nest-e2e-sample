import { Module, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect, PostgresDialectConfig } from 'kysely';
import {
  getKyselyOptionsToken,
  InjectKysely,
  KYSELY_OPTIONS_TOKEN,
  KYSELY_TOKEN,
} from './kysely.constants';

@Module({
  providers: [
    {
      provide: KYSELY_OPTIONS_TOKEN,
      useValue: {
        port: 25432,
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        database: 'postgres',
      },
    },
    {
      provide: KYSELY_TOKEN,
      inject: [getKyselyOptionsToken()],
      useFactory: async (options: PostgresDialectConfig) => {
        return new Kysely({
          dialect: new PostgresDialect(options),
        });
      },
    },
  ],
  exports: [KYSELY_TOKEN],
})
export class KyselyModule implements OnModuleDestroy {
  constructor(@InjectKysely() private readonly db: Kysely<any>) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
