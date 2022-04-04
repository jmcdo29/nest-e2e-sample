import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { NeighborhoodService } from './neighborhood.service';
import { getKyselyToken } from '../kysely/kysely.constants';

const NeighborhoodServiceSuite = suite<{ service: NeighborhoodService }>(
  'NeighborhoodService Suite',
);

NeighborhoodServiceSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    providers: [
      NeighborhoodService,
      {
        provide: getKyselyToken(),
        useValue: {},
      },
    ],
  }).compile();
  context.service = app.get(NeighborhoodService);
});

NeighborhoodServiceSuite('service should exist', ({ service }) => {
  ok(service);
});

NeighborhoodServiceSuite.run();
