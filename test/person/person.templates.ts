import { stash } from 'pactum';
import { PersonConstants } from './person.constants';

stash.addDataTemplate({
  [PersonConstants.templates.new]: {
    name: 'Testy',
    family_id: '',
    role: 'adult',
  },
});
