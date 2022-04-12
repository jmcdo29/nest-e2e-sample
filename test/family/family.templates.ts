import { stash } from 'pactum';
import { FamilyConstants } from './family.constants';

stash.addDataTemplate({
  [FamilyConstants.templates.new]: {
    name: 'Testersons',
    neighborhood_id: '',
  },
});
