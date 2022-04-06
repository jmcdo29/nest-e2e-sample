import { Test, TestingModule } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';

const FamilyControllerSuite = suite<{
  controller: FamilyController;
}>('FamilyController Suite');

FamilyControllerSuite.before(async (context) => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [FamilyController],
    providers: [
      {
        provide: FamilyService,
        useValue: {},
      },
    ],
  }).compile();

  context.controller = module.get<FamilyController>(FamilyController);
});
FamilyControllerSuite('controller exists', ({ controller }) => {
  ok(controller);
});

FamilyControllerSuite.run();
