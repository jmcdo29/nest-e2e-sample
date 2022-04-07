import { Injectable } from '@nestjs/common';
import {
  Insertable,
  InsertType,
  Kysely,
  Selectable,
  Updateable,
  UpdateType,
} from 'kysely';
import { Database, InjectKysely, Person } from '../kysely';

@Injectable()
export class PersonService {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async getPersons(): Promise<Selectable<Person>[]> {
    return this.db.selectFrom('person').selectAll().execute();
  }

  async getPersonById(id: string): Promise<Selectable<Person>> {
    return this.db
      .selectFrom('person')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async getPersonByName(name: string): Promise<Selectable<Person>> {
    return this.db
      .selectFrom('person')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirstOrThrow();
  }

  async addNewPerson(person: InsertType<Person>): Promise<Insertable<Person>> {
    return this.db
      .insertInto('person')
      .values([person])
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updatePerson(
    person: Omit<UpdateType<Person>, 'id'>,
    id: string,
  ): Promise<Updateable<Person>> {
    await this.db
      .updateTable('person')
      .where('id', '=', id)
      .set(person)
      .executeTakeFirstOrThrow();
    return { ...person, id };
  }

  async deletePerson(
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.db
      .deleteFrom('person')
      .where('id', '=', id)
      .executeTakeFirst();
    if (result.numDeletedRows === BigInt(1)) {
      return { success: true };
    }
    return {
      success: false,
      error: `Could not delete person with id ${id}`,
    };
  }
}
