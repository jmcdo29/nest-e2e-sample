import { handler } from 'pactum';
import {
  FamilyConstants,
  PersonConstants,
  override,
  template,
  uuidRegex,
} from '../../constants';
import { getStash } from '../../utils';

handler.addSpecHandler(PersonConstants.specs.add, ({ spec, data }) => {
  spec
    .post(PersonConstants.baseRoutes)
    .withJson({
      [template]: PersonConstants.templates.new,
      [override]: {
        family_id: getStash(`Person${FamilyConstants.keys.id}`),
        ...(data.override ?? {}),
      },
    })
    .expectStatus(201)
    .expectJsonLike('.id', uuidRegex)
    .stores(`${data?.prefix ?? ''}${PersonConstants.keys.id}`, '.id');
});
