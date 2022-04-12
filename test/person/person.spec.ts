import { e2e as pactumE2E } from 'pactum';
import E2E from 'pactum/src/models/E2E';
import { suite } from 'uvu';
import { FamilyConstants } from '../family';
import { NeighborhoodConstants } from '../neighborhood';
import { getStash } from '../utils';
import { PersonConstants } from './person.constants';

const PersonSuite = suite<{ e2e: E2E }>('Person Suite', {
  e2e: pactumE2E('Person Suite'),
});

PersonSuite('Add Neighborhood', async ({ e2e }) => {
  const step = e2e.step('Add Neighborhood for Person');
  await step
    .spec(NeighborhoodConstants.specs.add, {
      key: 'Person-Family',
      overrides: {
        name: 'Person-Family Test Neighborhood',
        location: 'E',
      },
    })
    .toss();
  step.clean(NeighborhoodConstants.specs.delete, {
    id: getStash(`Person-Family${NeighborhoodConstants.keys.id}`),
  });
});

PersonSuite('Create Family', async ({ e2e }) => {
  const step = e2e.step('Create Family for Person');
  await step
    .spec(FamilyConstants.specs.add, {
      overrides: {
        neighborhood_id: getStash(
          `Person-Family${NeighborhoodConstants.keys.id}`,
        ),
        name: 'PersonPeople',
      },
      key: 'Person',
    })
    .toss();
  step.clean(FamilyConstants.specs.delete, {
    id: getStash(`Person${FamilyConstants.keys.id}`),
  });
});

PersonSuite('Populate adult', async ({ e2e }) => {
  const createAdult = e2e.step('Create adult');
  await createAdult.spec(PersonConstants.specs.add, { prefix: 'adult' }).toss();
  createAdult.clean(PersonConstants.specs.delete, {
    id: getStash(`adult${PersonConstants.keys.id}`),
  });
});
PersonSuite('Populate Guardian', async ({ e2e }) => {
  const createGuardian = e2e.step('Create Guardian');
  await createGuardian
    .spec(PersonConstants.specs.add, {
      override: { role: 'guardian', name: 'Amelia' },
      prefix: 'guardian',
    })
    .toss();
  createGuardian.clean(PersonConstants.specs.delete, {
    id: getStash(`guardian${PersonConstants.keys.id}`),
  });
});
PersonSuite('Populate Child', async ({ e2e }) => {
  const createChild = e2e.step('Create Child');
  await createChild
    .spec(PersonConstants.specs.add, {
      prefix: 'child',
      override: {
        role: 'child',
        name: 'Robert',
      },
    })
    .toss();
  createChild.clean(PersonConstants.specs.delete, {
    id: getStash(`child${PersonConstants.keys.id}`),
  });
});

PersonSuite('Get Persons', async ({ e2e }) => {
  const step = e2e.step('Get all persons');
  await step
    .spec()
    .get(PersonConstants.baseRoutes)
    .expectStatus(200)
    .expectJsonLike('[*].name', ['Robert', 'Amelia', 'Testy'])
    .expectJsonLike('[*].id', [
      getStash(`adult${PersonConstants.keys.id}`),
      getStash(`guardian${PersonConstants.keys.id}`),
      getStash(`child${PersonConstants.keys.id}`),
    ])
    .toss();
});

PersonSuite('Update Child name', async ({ e2e }) => {
  const step = e2e.step('Update child name');
  await step
    .spec()
    .patch(`${PersonConstants.baseRoutes}/{id}`)
    .withPathParams({ id: getStash(`child${PersonConstants.keys.id}`) })
    .withJson({ name: 'Robbie' })
    .expectStatus(200)
    .expectJson({
      name: 'Robbie',
      id: getStash(`child${PersonConstants.keys.id}`),
    })
    .toss();
});

PersonSuite('Cleanup', async ({ e2e }) => {
  await e2e.cleanup();
});
PersonSuite.run();
