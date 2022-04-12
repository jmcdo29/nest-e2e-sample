import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { KyselyModule } from './kysely/kysely.module';
import { FamilyModule } from './family/family.module';
import { PersonModule } from './person/person.module';
import { OgmaInterceptor, OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    OgmaModule.forRoot({
      service: {
        application: 'E2E Sample',
      },
      interceptor: {
        http: ExpressParser,
      },
    }),
    NeighborhoodModule,
    KyselyModule,
    FamilyModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: OgmaInterceptor,
    },
  ],
})
export class AppModule {}
