import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InsertType, UpdateType } from 'kysely';
import { Person } from '../kysely';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Get()
  async getAll() {
    return this.service.getPersons();
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    return this.service.getPersonById(id);
  }

  @Get('/name/:name')
  async getByName(@Param('name') name: string) {
    return this.service.getPersonByName(name);
  }

  @Post()
  async newPerson(@Body() body: InsertType<Person>) {
    return this.service.addNewPerson(body);
  }

  @Patch(':id')
  async updatePerson(
    @Body() body: UpdateType<Person>,
    @Param('id') id: string,
  ) {
    return this.service.updatePerson(body, id);
  }

  @Delete(':id')
  async deletePerson(@Param('id') id: string) {
    return this.service.deletePerson(id);
  }
}
