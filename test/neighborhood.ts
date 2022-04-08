import { e2e } from 'pactum';
import E2E from 'pactum/src/models/E2E';
import { suite } from 'uvu';

export const NeighborSuite = suite<{ neighborE2E: E2E }>('Neighborhood E2E', {
  neighborE2E: e2e('Add Neighborhood'),
});
NeighborSuite('Create Neighborhood', async ({ neighborE2E }) => {
  const addStep = neighborE2E.step('add');
  await addStep.spec('Neighborhood:Add').toss();
  addStep.clean('Neighborhood:Delete', { id: '$S{NeighborhoodID}' });
});
NeighborSuite('Get Neighborhood', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get Neighborhood')
    .spec()
    .get('/neighborhood/id/{id}')
    .withPathParams({ id: '$S{NeighborhoodID}' })
    .expectStatus(200)
    .expectBody({
      name: 'Test Neighborhood',
      location: 'N',
      id: '$S{NeighborhoodID}',
    })
    .toss();
});
NeighborSuite('Get Neighborhood By Name', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get by name')
    .spec()
    .get('/neighborhood/name/{name}')
    .withPathParams({ name: 'Test Neighborhood' })
    .expectStatus(200)
    .expectJsonLike({
      name: 'Test Neighborhood',
      location: 'N',
      id: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    })
    .toss();
});
NeighborSuite('Add another neighborhood', async ({ neighborE2E }) => {
  const anotherNeighborhoodStep = neighborE2E.step('Add Another Neighborhood');
  await anotherNeighborhoodStep
    .spec('Neighborhood:Add', {
      key: 'Saddleclub',
      overrides: {
        '@OVERRIDES@': {
          name: 'Saddleclub',
          location: 'N',
        },
      },
    })
    .toss();
  anotherNeighborhoodStep.clean('Neighborhood:Delete', {
    id: '$S{SaddleclubNeighborhoodID}',
  });
});
NeighborSuite('Get all Neighborhoods in N', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get all Neighborhoods in N')
    .spec()
    .get('/neighborhood/location/N')
    .expectStatus(200)
    .expectJsonLength(2)
    .expectJsonLike('[*].name', ['Test Neighborhood', 'Saddleclub'])
    .toss();
});
NeighborSuite('Update Saddleclub to S', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Update Neighborhood location')
    .spec()
    .patch('/neighborhood/{id}')
    .withJson({ location: 'S' })
    .withPathParams({ id: '$S{SaddleclubNeighborhoodID}' })
    .expectStatus(200)
    .toss();
});
NeighborSuite('Get all Neighborhoods in N', async ({ neighborE2E }) => {
  await neighborE2E
    .step('Get all Neighborhoods in N')
    .spec()
    .get('/neighborhood/location/N')
    .expectStatus(200)
    .expectJsonLength(1)
    .expectJsonLike('[*].name', ['Test Neighborhood'])
    .toss();
});
NeighborSuite('Cleanup', async ({ neighborE2E }) => {
  await neighborE2E.cleanup();
});

export default NeighborSuite;
