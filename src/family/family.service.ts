import { Injectable } from '@nestjs/common';
import {
  Insertable,
  InsertType,
  Kysely,
  Selectable,
  Updateable,
  UpdateType,
} from 'kysely';
import { Database, Family, InjectKysely } from '../kysely';

@Injectable()
export class FamilyService {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async getFamilies(): Promise<Selectable<Family>[]> {
    return this.db.selectFrom('family').selectAll().execute();
  }

  async getFamilyById(id: string): Promise<Selectable<Family>> {
    return this.db
      .selectFrom('family')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async getFamilyByName(name: string): Promise<Selectable<Family>> {
    return this.db
      .selectFrom('family')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirstOrThrow();
  }

  async addNewFamily(family: InsertType<Family>): Promise<Insertable<Family>> {
    return this.db
      .insertInto('family')
      .values([family])
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateFamily(
    family: Omit<UpdateType<Family>, 'id'>,
    id: string,
  ): Promise<Updateable<Family>> {
    await this.db
      .updateTable('family')
      .where('id', '=', id)
      .set(family)
      .executeTakeFirstOrThrow();
    return { ...family, id };
  }

  async deleteFamily(
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.db
      .deleteFrom('family')
      .where('id', '=', id)
      .executeTakeFirst();
    if (result.numDeletedRows === BigInt(1)) {
      return { success: true };
    }
    return {
      success: false,
      error: `Could not delete family with id ${id}`,
    };
  }
}
