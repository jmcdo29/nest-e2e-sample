import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';

@Module({
  providers: [FamilyService],
  controllers: [FamilyController]
})
export class FamilyModule {}
