import { Test } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { PersonService } from './person.service';
import { getKyselyToken } from '../kysely/kysely.constants';

const PersonServiceSuite = suite<{ service: PersonService }>(
  'PersonService Suite',
);

PersonServiceSuite.before(async (context) => {
  const app = await Test.createTestingModule({
    providers: [
      PersonService,
      {
        provide: getKyselyToken(),
        useValue: {},
      },
    ],
  }).compile();
  context.service = app.get(PersonService);
});

PersonServiceSuite('service should exist', ({ service }) => {
  ok(service);
});

PersonServiceSuite.run();
