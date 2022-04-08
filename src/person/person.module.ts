import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { KyselyModule } from '../kysely';

@Module({
  imports: [KyselyModule],
  providers: [PersonService],
  controllers: [PersonController],
})
export class PersonModule {}
