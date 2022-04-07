import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';

@Module({
  providers: [PersonService],
  controllers: [PersonController]
})
export class PersonModule {}
