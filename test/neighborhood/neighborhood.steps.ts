import { handler } from 'pactum';
import { override, template } from '../constants';
import { NeighborhoodConstants } from './neighborhood.constants';

handler.addSpecHandler(NeighborhoodConstants.specs.add, ({ spec, data }) => {
  spec
    .post(NeighborhoodConstants.baseRoute)
    .withJson({
      [template]: NeighborhoodConstants.templates.new,
      ...(data?.overrides ? { [override]: data.overrides } : {}),
    })
    .expectStatus(201)
    .stores(`${data?.key ?? ''}${NeighborhoodConstants.keys.id}`, '.id');
});
handler.addSpecHandler(NeighborhoodConstants.specs.delete, ({ spec, data }) => {
  spec
    .delete(`${NeighborhoodConstants.baseRoute}/{id}`)
    .withPathParams({ id: data.id })
    .expectStatus(200)
    .expectBody({ success: true });
});
