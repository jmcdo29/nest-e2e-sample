import { Test, TestingModule } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { PersonController } from './person.controller';
import { PersonService } from './person.service';

const PersonControllerSuite = suite<{
  controller: PersonController;
}>('PersonController Suite');

PersonControllerSuite.before(async (context) => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [PersonController],
    providers: [
      {
        provide: PersonService,
        useValue: {},
      },
    ],
  }).compile();

  context.controller = module.get<PersonController>(PersonController);
});
PersonControllerSuite('controller exists', ({ controller }) => {
  ok(controller);
});

PersonControllerSuite.run();
