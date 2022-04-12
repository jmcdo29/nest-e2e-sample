import { e2e as pactumE2E } from 'pactum';
import E2E from 'pactum/src/models/E2E';
import { suite } from 'uvu';
import { FamilyConstants, NeighborhoodConstants, uuidRegex } from './constants';
import { getStash } from './utils';

const route = FamilyConstants.baseRoute;
export const FamilySuite = suite<{ e2e: E2E }>('Family E2E', {
  e2e: pactumE2E('Family E2e'),
});

FamilySuite('Create Neighborhood for Family', async ({ e2e }) => {
  const neighborhoodStep = e2e.step('Create Neighborhood');
  await neighborhoodStep
    .spec(NeighborhoodConstants.specs.add, {
      key: `Family`,
      overrides: {
        name: 'Family Test Neighborhood',
        location: 'N',
      },
    })
    .toss();
  neighborhoodStep.clean(NeighborhoodConstants.specs.delete, {
    id: getStash(`Family${NeighborhoodConstants.keys.id}`),
  });
});
FamilySuite('Create Family', async ({ e2e }) => {
  const familyStep = e2e.step('Create Family');
  await familyStep.spec(FamilyConstants.specs.add).toss();
  familyStep.clean(FamilyConstants.specs.delete, {
    id: getStash(FamilyConstants.keys.id),
  });
});
FamilySuite('Get Family by name', async ({ e2e }) => {
  await e2e
    .step('Get Family by Name')
    .spec()
    .get(`${route}/name/Testersons`)
    .expectStatus(200)
    .expectJsonLike({
      neighborhood_id: uuidRegex,
      id: uuidRegex,
      name: 'Testersons',
    })
    .toss();
});
FamilySuite('Update Last Name', async ({ e2e }) => {
  await e2e
    .step('Update Name')
    .spec()
    .patch(`${route}/{id}`)
    .withPathParams({ id: getStash(FamilyConstants.keys.id) })
    .withJson({
      name: 'Testers',
    })
    .expectStatus(200)
    .expectJsonLike({
      name: 'Testers',
      id: getStash(FamilyConstants.keys.id),
    })
    .toss();
});
FamilySuite('Clean up', async ({ e2e }) => {
  await e2e.cleanup();
});
FamilySuite.run();
