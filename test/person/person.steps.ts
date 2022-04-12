import { handler } from 'pactum';
import { override, template, uuidRegex } from '../constants';
import { FamilyConstants } from '../family';
import { getStash } from '../utils';
import { PersonConstants } from './person.constants';

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
handler.addSpecHandler(PersonConstants.specs.delete, ({ spec, data }) => {
  spec
    .delete(`${PersonConstants.baseRoutes}/{id}`)
    .withPathParams({ id: data.id })
    .expectStatus(200)
    .expectJson({ success: true });
});
