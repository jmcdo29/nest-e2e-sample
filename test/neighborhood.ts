import { e2e } from 'pactum';
import E2E from 'pactum/src/models/E2E';
import { suite } from 'uvu';
import { NeighborhoodConstants, uuidRegex } from './constants';

const route = NeighborhoodConstants.baseRoute;

export const NeighborSuite = suite<{ neighborE2E: E2E }>('Neighborhood E2E', {
  neighborE2E: e2e('Add Neighborhood'),
});
NeighborSuite('Create Neighborhood', async ({ neighborE2E }) => {
  const addStep = neighborE2E.step('add');
  await addStep.spec(NeighborhoodConstants.specs.add).toss();
  addStep.clean(NeighborhoodConstants.specs.delete, {
    id: `$S{${NeighborhoodConstants.keys.id}}`,
  });
});
NeighborSuite('Get Neighborhood', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get Neighborhood')
    .spec()
    .get(`${route}/id/{id}`)
    .withPathParams({ id: `$S{${NeighborhoodConstants.keys.id}}` })
    .expectStatus(200)
    .expectBody({
      name: 'Test Neighborhood',
      location: 'N',
      id: `$S{${NeighborhoodConstants.keys.id}}`,
    })
    .toss();
});
NeighborSuite('Get Neighborhood By Name', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get by name')
    .spec()
    .get(`${route}/name/{name}`)
    .withPathParams({ name: 'Test Neighborhood' })
    .expectStatus(200)
    .expectJsonLike({
      name: 'Test Neighborhood',
      location: 'N',
      id: uuidRegex,
    })
    .toss();
});
NeighborSuite('Add another neighborhood', async ({ neighborE2E }) => {
  const anotherNeighborhoodStep = neighborE2E.step('Add Another Neighborhood');
  await anotherNeighborhoodStep
    .spec(NeighborhoodConstants.specs.add, {
      key: 'Saddleclub',
      overrides: {
        name: 'Saddleclub',
        location: 'N',
      },
    })
    .toss(),
    anotherNeighborhoodStep.clean(NeighborhoodConstants.specs.delete, {
      id: `$S{Saddleclub${NeighborhoodConstants.keys.id}}`,
    });
});
NeighborSuite('Get all Neighborhoods in N', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get all Neighborhoods in N')
    .spec()
    .get(`${route}/location/N`)
    .expectStatus(200)
    .expectJsonLength(2)
    .expectJsonLike('[*].name', ['Test Neighborhood', 'Saddleclub'])
    .toss();
});
NeighborSuite('Update Saddleclub to S', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Update Neighborhood location')
    .spec()
    .patch(`${route}/{id}`)
    .withJson({ location: 'S' })
    .withPathParams({ id: `$S{Saddleclub${NeighborhoodConstants.keys.id}}` })
    .expectStatus(200)
    .toss();
});
NeighborSuite('Get all Neighborhoods in N', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get all Neighborhoods in N')
    .spec()
    .get(`${route}/location/N`)
    .expectStatus(200)
    .expectJsonLength(1)
    .expectJsonLike('[*].name', ['Test Neighborhood'])
    .toss();
});
NeighborSuite('Cleanup', async ({ neighborE2E }) => {
  await neighborE2E.cleanup();
});
