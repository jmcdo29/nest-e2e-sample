import { Test, TestingModule } from '@nestjs/testing';
import { suite } from 'uvu';
import { equal } from 'uvu/assert';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const AppControllerSuite = suite<{ controller: AppController }>(
  'AppControllerSuite',
);

AppControllerSuite.before(async (context) => {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [AppController],
    providers: [
      { provide: AppService, useValue: { getHello: () => 'Hello World!' } },
    ],
  }).compile();

  context.controller = app.get<AppController>(AppController);
});

AppControllerSuite('return "Hello World!"', ({ controller }) => {
  equal(controller.getHello(), 'Hello World!');
});
AppControllerSuite.run();
