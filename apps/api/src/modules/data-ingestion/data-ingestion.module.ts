import { Module } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';
import { IngestionValidationService } from './ingestion-validation.service';
import { DataIngestionController } from './data-ingestion.controller';

@Module({
  controllers: [DataIngestionController],
  providers: [DataIngestionService, IngestionValidationService],
  exports: [DataIngestionService, IngestionValidationService]
})
export class DataIngestionModule {}
