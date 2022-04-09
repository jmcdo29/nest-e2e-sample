import { stash } from 'pactum';
import { NeighborhoodConstants } from '../constants';

stash.addDataTemplate({
  [NeighborhoodConstants.templates.new]: {
    name: 'Test Neighborhood',
    location: 'N',
  },
});
