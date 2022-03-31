import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KyselyModule } from './kysely/kysely.module';

@Module({
  imports: [KyselyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
