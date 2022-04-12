import './steps';
import './templates';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Ogma } from '@ogma/logger';
import { exec as cbExec } from 'child_process';
import { request } from 'pactum';
import { join } from 'path';
import { promisify } from 'util';
import { run as uvu } from 'uvu/run';

import { AppModule } from '../src/app.module';
import { getKyselyOptionsToken } from '../src/kysely';
import { parse } from 'uvu/parse';

const ogma = new Ogma({ application: 'E2E Sample Tests', logLevel: 'ALL' });

const exec = promisify(cbExec);

const runPostgres = async () => {
  ogma.debug('Checking if Postgres is running');
  const dockerStatus = JSON.parse(
    (await exec('docker compose -p test ps --format json')).stdout.toString(),
  );
  if (dockerStatus[0]?.State === 'running') {
    return;
  }
  ogma.debug('Postgres is not running. Starting via docker compose');
  await exec('docker compose -p test -f docker-compose.test.yml up -d');
  let exitCode = 1;
  do {
    try {
      await exec('nc -z localhost 35432');
      const exit = (await exec('echo $?')).stdout.toString();
      exitCode = parseInt(exit);
    } catch {
      exitCode = 1;
    }
  } while (exitCode !== 0);
  ogma.debug('netcat returned code 0. Finalizing wait time');
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const runMigrations = async () => {
  ogma.debug('Running Migrations');
  const { stdout } = await exec(
    'NODE_ENV=test node -r @swc/register db/index.ts',
  );
  ogma.debug(stdout);
};

const setupApplication = async (): Promise<INestApplication> => {
  ogma.debug('Creating Nest application');
  const modRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(getKyselyOptionsToken())
    .useValue({
      port: 35432,
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      database: 'test',
    })
    .compile();
  return modRef.createNestApplication();
};

const runUvu = async () => {
  const uvuCtx = await parse(
    join(process.cwd(), 'test'),
    /(person|neighborhood|family)\.ts$/,
    {
      ignore: [/(templates|steps|constants)/],
    },
  );
  await uvu(uvuCtx.suites, { bail: false });
};

const runTests = async () => {
  await runPostgres();
  await runMigrations();
  const app = await setupApplication();
  ogma.debug('Starting Nest application');
  await app.listen(0);
  const url = await app.getUrl();
  request.setBaseUrl(url.replace('[::1]', 'localhost'));
  ogma.debug('Running uvu programatically');
  await runUvu();
  ogma.debug('Closing Nest Application');
  await app.close();
  ogma.debug('E2E tests finished');
};

runTests();
