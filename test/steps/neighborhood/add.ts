import { handler } from 'pactum';
import { NeighborhoodConstants, override, template } from '../../constants';

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
