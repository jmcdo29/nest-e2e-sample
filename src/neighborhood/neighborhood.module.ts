import { Module } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { KyselyModule } from '../kysely';

@Module({
  imports: [KyselyModule],
  providers: [NeighborhoodService],
  controllers: [NeighborhoodController],
})
export class NeighborhoodModule {}
