import { handler } from 'pactum';

handler.addSpecHandler('Neighborhood:Delete', ({ spec, data }) => {
  spec
    .delete('/neighborhood/{id}')
    .withPathParams({ id: data.id })
    .expectStatus(200)
    .expectBody({ success: true });
});
