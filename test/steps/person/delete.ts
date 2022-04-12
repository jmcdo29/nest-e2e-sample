import { handler } from 'pactum';
import { PersonConstants } from '../../constants';

handler.addSpecHandler(PersonConstants.specs.delete, ({ spec, data }) => {
  spec
    .delete(`${PersonConstants.baseRoutes}/{id}`)
    .withPathParams({ id: data.id })
    .expectStatus(200)
    .expectJson({ success: true });
});
