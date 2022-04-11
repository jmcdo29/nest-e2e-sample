import { handler } from 'pactum';
import { FamilyConstants } from '../../constants';

handler.addSpecHandler(FamilyConstants.specs.delete, ({ spec, data }) => {
  spec
    .delete(`${FamilyConstants.baseRoute}/{id}`)
    .withPathParams({ id: data.id })
    .expectStatus(200)
    .expectBody({ success: true });
});
