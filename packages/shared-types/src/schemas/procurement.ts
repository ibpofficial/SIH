import { z } from 'zod';

export const ProcurementStatusSchema = z.enum([
  'DRAFT',
  'OPTIMIZING',
  'OPTIMIZED',
  'RFQ_SENT',
  'AWARDED',
  'COMPLETED',
  'CANCELLED'
]);

export type ProcurementStatus = z.infer<typeof ProcurementStatusSchema>;

export const CreateProcurementRequestSchema = z.object({
  commodity: z.string().min(2, 'Commodity is required'),
  quantityMt: z.number().positive('Quantity (MT) must be > 0'),
  originPortId: z.string().uuid('Origin port selection is required'),
  destinationPortId: z.string().uuid('Destination port selection is required'),
  requiredDeliveryDate: z.string().min(1, 'Required delivery date is required'),
  budgetInrCrore: z.number().positive('Budget (₹ crore) must be > 0'),
  notes: z.string().optional()
});

export type CreateProcurementRequestInput = z.infer<typeof CreateProcurementRequestSchema>;

export interface ProcurementRequestDetails {
  id: string;
  organizationId: string;
  commodity: string;
  quantityMt: number;
  originPortId: string;
  originPortName: string;
  originPortCode: string;
  destinationPortId: string;
  destinationPortName: string;
  destinationPortCode: string;
  requiredDeliveryDate: string;
  budgetInrCrore: number;
  status: ProcurementStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
