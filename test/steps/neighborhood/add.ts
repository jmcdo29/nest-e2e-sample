import { handler } from 'pactum';

handler.addSpecHandler('Neighborhood:Add', ({ spec, data }) => {
  spec
    .post('/neighborhood')
    .withJson({
      '@DATA:TEMPLATE@': 'Neighborhood.New',
      ...(data?.overrides ?? {}),
    })
    .expectStatus(201)
    .stores(`${data?.key ?? ''}NeighborhoodID`, '.id');
});
