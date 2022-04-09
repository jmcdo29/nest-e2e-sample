import { handler } from 'pactum';
import { NeighborhoodConstants } from '../../constants';

handler.addSpecHandler(NeighborhoodConstants.specs.delete, ({ spec, data }) => {
  spec
    .delete(`${NeighborhoodConstants.baseRoute}/{id}`)
    .withPathParams({ id: data.id })
    .expectStatus(200)
    .expectBody({ success: true });
});
