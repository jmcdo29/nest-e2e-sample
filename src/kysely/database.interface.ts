import { Generated } from 'kysely';

export enum Location {
  N = 'N',
  S = 'S',
  W = 'W',
  E = 'E',
}

export interface Neighborhood {
  name: string;
  id: Generated<string>;
  location: Location;
}

export interface Database {
  neighborhood: Neighborhood;
}
