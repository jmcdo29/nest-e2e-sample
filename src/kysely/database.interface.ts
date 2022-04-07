import { Generated } from 'kysely';

export enum Location {
  N = 'N',
  S = 'S',
  W = 'W',
  E = 'E',
}

export enum FamilyRole {
  mother = 'mother',
  father = 'father',
  child = 'child',
}

export interface Neighborhood {
  name: string;
  id: Generated<string>;
  location: Location;
}

export interface Family {
  name: string;
  id: Generated<string>;
  neighborhood_id: string;
}

export interface Person {
  name: string;
  id: Generated<string>;
  role: FamilyRole;
  family_id: string;
}

export interface Database {
  neighborhood: Neighborhood;
  family: Family;
  person: Person;
}
