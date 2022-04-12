import { e2e as pactumE2E } from 'pactum';
import E2E from 'pactum/src/models/E2E';
import { suite } from 'uvu';
import { uuidRegex } from '../constants';
import { getStash } from '../utils';
import { NeighborhoodConstants } from './neighborhood.constants';

const route = NeighborhoodConstants.baseRoute;

export const NeighborSuite = suite<{ e2e: E2E }>('Neighborhood E2E', {
  e2e: pactumE2E('Add Neighborhood'),
});
NeighborSuite('Create Neighborhood', async ({ e2e }) => {
  const addStep = e2e.step('add');
  await addStep.spec(NeighborhoodConstants.specs.add).toss();
  addStep.clean(NeighborhoodConstants.specs.delete, {
    id: getStash(NeighborhoodConstants.keys.id),
  });
});
NeighborSuite('Get Neighborhood', async ({ e2e }) => {
  await e2e
    .step('Get Neighborhood')
    .spec()
    .get(`${route}/id/{id}`)
    .withPathParams({ id: getStash(NeighborhoodConstants.keys.id) })
    .expectStatus(200)
    .expectBody({
      name: 'Test Neighborhood',
      location: 'N',
      id: getStash(NeighborhoodConstants.keys.id),
    })
    .toss();
});
NeighborSuite('Get Neighborhood By Name', async ({ e2e }) => {
  await e2e
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
NeighborSuite('Add another neighborhood', async ({ e2e }) => {
  const anotherNeighborhoodStep = e2e.step('Add Another Neighborhood');
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
      id: getStash(`Saddleclub${NeighborhoodConstants.keys.id}`),
    });
});
NeighborSuite('Get all Neighborhoods in N', async ({ e2e }) => {
  await e2e
    .step('Get all Neighborhoods in N')
    .spec()
    .get(`${route}/location/N`)
    .expectStatus(200)
    .expectJsonLike('[*].name', ['Test Neighborhood', 'Saddleclub'])
    .expectJsonLike('[*].id', [
      getStash(`Saddleclub${NeighborhoodConstants.keys.id}`),
      getStash(`${NeighborhoodConstants.keys.id}`),
    ])
    .toss();
});
NeighborSuite('Update Saddleclub to S', async ({ e2e }) => {
  await e2e
    .step('Update Neighborhood location')
    .spec()
    .patch(`${route}/{id}`)
    .withJson({ location: 'S' })
    .withPathParams({
      id: getStash(`Saddleclub${NeighborhoodConstants.keys.id}`),
    })
    .expectStatus(200)
    .toss();
});
NeighborSuite('Get all Neighborhoods in N', async ({ e2e }) => {
  await e2e
    .step('Get all Neighborhoods in N')
    .spec()
    .get(`${route}/location/N`)
    .expectStatus(200)
    .expectJsonLength(1)
    .expectJsonLike('[*].name', ['Test Neighborhood'])
    .toss();
});
NeighborSuite('Cleanup', async ({ e2e }) => {
  await e2e.cleanup();
});
NeighborSuite.run();
