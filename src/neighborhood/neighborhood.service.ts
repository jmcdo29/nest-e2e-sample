import { Injectable } from '@nestjs/common';
import {
  Insertable,
  InsertType,
  Kysely,
  Selectable,
  Updateable,
  UpdateType,
} from 'kysely';
import { Database, InjectKysely, Location, Neighborhood } from '../kysely';

@Injectable()
export class NeighborhoodService {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async getNeighborhoods(): Promise<Selectable<Neighborhood>[]> {
    return this.db.selectFrom('neighborhood').selectAll().execute();
  }

  async getNeighborhoodById(id: string): Promise<Selectable<Neighborhood>> {
    return this.db
      .selectFrom('neighborhood')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async getNeighborhoodByName(name: string): Promise<Selectable<Neighborhood>> {
    return this.db
      .selectFrom('neighborhood')
      .selectAll()
      .where('name', '=', name)
      .executeTakeFirstOrThrow();
  }

  async getNeighborhoodByLocation(
    location: Location,
  ): Promise<Selectable<Neighborhood>[]> {
    return this.db
      .selectFrom('neighborhood')
      .selectAll()
      .where('location', '=', location)
      .execute();
  }

  async addNewNeighborhood(
    neighborhood: InsertType<Neighborhood>,
  ): Promise<Insertable<Neighborhood>> {
    return this.db
      .insertInto('neighborhood')
      .values([neighborhood])
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateNeighborhood(
    neighborhood: UpdateType<Neighborhood>,
    id: string,
  ): Promise<Updateable<Neighborhood>> {
    await this.db
      .updateTable('neighborhood')
      .set({ location: neighborhood.location, name: neighborhood.name })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return { ...neighborhood, id };
  }

  async deleteNeighborhood(
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.db
      .deleteFrom('neighborhood')
      .where('id', '=', id)
      .executeTakeFirst();
    if (result.numDeletedRows === BigInt(1)) {
      return { success: true };
    }
    return {
      success: false,
      error: `Could not delete neighborhood with id ${id}`,
    };
  }
}
