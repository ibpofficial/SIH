import { Module } from '@nestjs/common';
import { ProcurementController } from './procurement.controller';
import { ProcurementService } from './procurement.service';
import { DatabaseModule } from '../database/database.module';
import { AiExplanationModule } from '../ai-explanation/ai-explanation.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, AiExplanationModule, AuditModule],
  controllers: [ProcurementController],
  providers: [ProcurementService],
  exports: [ProcurementService]
})
export class ProcurementModule {}

