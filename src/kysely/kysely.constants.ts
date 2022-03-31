import { Inject } from '@nestjs/common';

export const KYSELY_TOKEN = Symbol('kysely:provider');
export const KYSELY_OPTIONS_TOKEN = Symbol('kysely:options:provider');

export const getKyselyOptionsToken = () => KYSELY_OPTIONS_TOKEN;

export const InjectKysely = () => Inject(KYSELY_TOKEN);
