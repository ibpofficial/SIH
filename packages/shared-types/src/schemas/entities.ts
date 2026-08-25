import { z } from 'zod';

// Organization Schema
export const OrganizationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Organization name is required'),
  code: z.string().min(2, 'Organization code is required'),
  type: z.enum(['CHARTERER', 'SHIPOWNER', 'TRADER', 'PORT_AUTHORITY', 'BROKER'])
});
export type OrganizationInput = z.infer<typeof OrganizationSchema>;

// Port Schema
export const PortSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Port name is required'),
  code: z.string().min(2, 'UN/LOCODE or port code required'),
  country: z.string().min(2, 'Country is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  maxDraftM: z.number().positive('Max draft must be > 0'),
  maxLengthM: z.number().positive('Max length must be > 0'),
  handlingCapacityMtPerDay: z.number().positive('Handling capacity must be > 0'),
  storageCapacityMt: z.number().nonnegative('Storage capacity must be >= 0'),
  avgTurnaroundDays: z.number().positive('Avg turnaround must be > 0')
});
export type PortInput = z.infer<typeof PortSchema>;

// Vessel Type Schema
export const VesselTypeSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(2, 'Vessel type code required'),
  name: z.string().min(2, 'Vessel type name required'),
  capacityMinMt: z.number().positive(),
  capacityMaxMt: z.number().positive(),
  draftM: z.number().positive(),
  lengthM: z.number().positive(),
  beamM: z.number().positive(),
  avgSpeedKnots: z.number().positive(),
  operatingCostPerDay: z.number().positive()
});
export type VesselTypeInput = z.infer<typeof VesselTypeSchema>;

// Vessel Schema
export const VesselSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Vessel name required'),
  imoNumber: z.string().regex(/^\d{7}$/, 'IMO number must be exactly 7 digits'),
  vesselTypeId: z.string().uuid('Vessel Type ID required'),
  capacityMt: z.number().positive('Capacity MT must be > 0'),
  draftM: z.number().positive('Draft must be > 0'),
  speedKnots: z.number().positive('Speed must be > 0'),
  status: z.enum(['AVAILABLE', 'CHARTERED', 'IN_TRANSIT', 'MAINTENANCE']).default('AVAILABLE')
});
export type VesselInput = z.infer<typeof VesselSchema>;

// Cargo Requirement Schema
export const CargoSchema = z.object({
  id: z.string().uuid().optional(),
  commodity: z.string().min(2, 'Commodity is required'),
  quantityMt: z.number().positive('Quantity must be > 0'),
  originPortId: z.string().uuid('Origin port required'),
  destinationPortId: z.string().uuid('Destination port required'),
  laycanStartDate: z.string().or(z.date()),
  laycanEndDate: z.string().or(z.date()),
  maxMoisturePct: z.number().min(0).max(100).optional(),
  maxAshPct: z.number().min(0).max(100).optional()
});
export type CargoInput = z.infer<typeof CargoSchema>;

// Freight Rate Schema
export const FreightRateSchema = z.object({
  id: z.string().uuid().optional(),
  originPortId: z.string().uuid('Origin port required'),
  destinationPortId: z.string().uuid('Destination port required'),
  vesselTypeId: z.string().uuid('Vessel type required'),
  cargoType: z.string().min(2, 'Cargo type required'),
  rateUsdPerMt: z.number().positive('Freight rate must be > 0'),
  rateDate: z.string().or(z.date())
});
export type FreightRateInput = z.infer<typeof FreightRateSchema>;
