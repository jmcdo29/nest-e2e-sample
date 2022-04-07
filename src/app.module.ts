import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { KyselyModule } from './kysely/kysely.module';
import { FamilyModule } from './family/family.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [NeighborhoodModule, KyselyModule, FamilyModule, PersonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
