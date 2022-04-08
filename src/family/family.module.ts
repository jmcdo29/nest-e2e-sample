import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { KyselyModule } from '../kysely';

@Module({
  imports: [KyselyModule],
  providers: [FamilyService],
  controllers: [FamilyController],
})
export class FamilyModule {}
