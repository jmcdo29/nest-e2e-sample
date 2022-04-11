import { stash } from 'pactum';
import { FamilyConstants } from '../constants';

stash.addDataTemplate({
  [FamilyConstants.templates.new]: {
    name: 'Testersons',
    neighborhood_id: '',
  },
});
