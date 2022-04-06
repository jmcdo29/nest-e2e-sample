import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { InsertType, UpdateType } from 'kysely';
import { Family } from '../kysely';
import { FamilyService } from './family.service';

@Controller('family')
export class FamilyController {
  constructor(private readonly service: FamilyService) {}

  @Get()
  async getAll() {
    return this.service.getFamilies();
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    return this.service.getFamilyById(id);
  }

  @Get('/name/:name')
  async getByName(@Param('name') name: string) {
    return this.service.getFamilyByName(name);
  }

  @Post()
  async newFamily(@Body() body: InsertType<Family>) {
    return this.service.addNewFamily(body);
  }

  @Patch(':id')
  async updateFamily(
    @Body() body: UpdateType<Family>,
    @Param('id') id: string,
  ) {
    return this.service.updateFamily(body, id);
  }

  @Delete(':id')
  async deleteFamily(@Param('id') id: string) {
    return this.service.deleteFamily(id);
  }
}
