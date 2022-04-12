import { handler } from 'pactum';
import {
  FamilyConstants,
  NeighborhoodConstants,
  override,
  template,
} from '../../constants';
import { getStash } from '../../utils';

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
