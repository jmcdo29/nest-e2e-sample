import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { KyselyModule } from './kysely/kysely.module';

@Module({
  imports: [NeighborhoodModule, KyselyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
