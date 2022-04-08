import './steps';
import './templates';

import { Test } from '@nestjs/testing';
import { request } from 'pactum';

import { AppModule } from '../src/app.module';

import { NeighborSuite } from './neighborhood';
import { getKyselyOptionsToken } from '../src/kysely';
import { INestApplication } from '@nestjs/common';
import { exec as cbExec } from 'child_process';
import { exec as uvu } from 'uvu';
import { promisify } from 'util';

const exec = promisify(cbExec);

const runPostgres = async () => {
  const dockerStatus = JSON.parse(
    (await exec('docker compose -p test ps --format json')).stdout.toString(),
  );
  if (dockerStatus[0]?.State === 'running') {
    return;
  }
  await exec('docker compose -p test -f docker-compose.test.yml up -d');
  let exitCode = 1;
  do {
    try {
      console.log('Testing docker database connection');
      await exec('nc -z localhost 35432');
      const exit = (await exec('echo $?')).stdout.toString();
      exitCode = parseInt(exit);
    } catch {
      exitCode = 1;
    }
  } while (exitCode !== 0);
};

const runMigrations = async () => {
  const { stdout } = await exec(
    'NODE_ENV=test node -r @swc/register db/index.ts',
  );
  console.log(stdout);
};

const setupApplication = async (): Promise<INestApplication> => {
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

const runTests = async () => {
  await runPostgres();
  await runMigrations();
  const app = await setupApplication();
  await app.listen(0);
  const url = await app.getUrl();
  request.setBaseUrl(url.replace('[::1]', 'localhost'));

  NeighborSuite.run();
  await uvu();
  await app.close();
};

runTests();
