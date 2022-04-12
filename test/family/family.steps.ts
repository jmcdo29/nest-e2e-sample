import { handler } from 'pactum';
import { override, template } from '../constants';
import { NeighborhoodConstants } from '../neighborhood';
import { getStash } from '../utils';
import { FamilyConstants } from './family.constants';

handler.addSpecHandler(FamilyConstants.specs.add, ({ spec, data }) => {
  spec
    .post('/family')
    .withJson({
      [template]: FamilyConstants.templates.new,
      [override]: {
        neighborhood_id: getStash(`Family${NeighborhoodConstants.keys.id}`),
        ...(data?.overrides ?? {}),
      },
    })
    .expectStatus(201)
    .stores(`${data?.key ?? ''}${FamilyConstants.keys.id}`, '.id');
});

handler.addSpecHandler(FamilyConstants.specs.delete, ({ spec, data }) => {
  spec
    .delete(`${FamilyConstants.baseRoute}/{id}`)
    .withPathParams({ id: data.id })
    .expectStatus(200)
    .expectBody({ success: true });
});
