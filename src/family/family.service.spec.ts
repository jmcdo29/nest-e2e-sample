import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { FamilyService } from './family.service';
import { getKyselyToken } from '../kysely/kysely.constants';

const FamilyServiceSuite = suite<{ service: FamilyService }>(
  'FamilyService Suite',
);

FamilyServiceSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    providers: [
      FamilyService,
      {
        provide: getKyselyToken(),
        useValue: {},
      },
    ],
  }).compile();
  context.service = app.get(FamilyService);
});

FamilyServiceSuite('service should exist', ({ service }) => {
  ok(service);
});

FamilyServiceSuite.run();
