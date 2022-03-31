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
import { Location, Neighborhood } from '../kysely';
import { NeighborhoodService } from './neighborhood.service';

@Controller('neighborhood')
export class NeighborhoodController {
  constructor(private readonly service: NeighborhoodService) {}

  @Get()
  async getAll() {
    return this.service.getNeighborhoods();
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    return this.service.getNeighborhoodById(id);
  }

  @Get('/name/:name')
  async getByName(@Param('name') name: string) {
    return this.service.getNeighborhoodByName(name);
  }

  @Get('location/:location')
  async getByLocation(@Param('location') location: Location) {
    return this.service.getNeighborhoodByLocation(location);
  }

  @Post()
  async newNeighborhood(@Body() body: InsertType<Neighborhood>) {
    return this.service.addNewNeighborhood(body);
  }

  @Patch(':id')
  async updateNeighborhood(
    @Body() body: UpdateType<Neighborhood>,
    @Param('id') id: string,
  ) {
    return this.service.updateNeighborhood(body, id);
  }

  @Delete(':id')
  async deleteNeighborhood(@Param('id') id: string) {
    return this.service.deleteNeighborhood(id);
  }
}
