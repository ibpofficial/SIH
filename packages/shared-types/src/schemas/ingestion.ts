import { z } from 'zod';

export const IngestionEntityTypeSchema = z.enum([
  'FREIGHT_RATE',
  'VESSEL',
  'PORT',
  'CARGO'
]);

export type IngestionEntityType = z.infer<typeof IngestionEntityTypeSchema>;

export const IngestionJobStatusSchema = z.enum([
  'PENDING',
  'VALIDATING',
  'VALIDATED',
  'FAILED',
  'COMMITTED'
]);

export type IngestionJobStatus = z.infer<typeof IngestionJobStatusSchema>;

export interface RowValidationError {
  rowNumber: number;
  stage: 1 | 2 | 3;
  stageName: 'Schema Validation' | 'Business Rules' | 'Referential Integrity';
  column?: string;
  value?: any;
  reason: string;
}

export interface DataImportJobSummary {
  id: string;
  filename: string;
  entityType: IngestionEntityType;
  status: IngestionJobStatus;
  rowCount: number;
  validRowCount: number;
  errorCount: number;
  warningCount: number;
  errors: RowValidationError[];
  uploadedBy: string;
  uploadedAt: string;
}
