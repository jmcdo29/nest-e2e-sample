import { Test, TestingModule } from '@nestjs/testing';
import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { NeighborhoodController } from './neighborhood.controller';
import { NeighborhoodService } from './neighborhood.service';

const NeighborhoodControllerSuite = suite<{
  controller: NeighborhoodController;
}>('NeighborhoodController Suite');

NeighborhoodControllerSuite.before(async (context) => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [NeighborhoodController],
    providers: [
      {
        provide: NeighborhoodService,
        useValue: {},
      },
    ],
  }).compile();

  context.controller = module.get<NeighborhoodController>(
    NeighborhoodController,
  );
});
NeighborhoodControllerSuite('controller exists', ({ controller }) => {
  ok(controller);
});

NeighborhoodControllerSuite.run();
