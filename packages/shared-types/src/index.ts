export * from './schemas/auth';
export * from './schemas/entities';
export * from './schemas/procurement';
export * from './schemas/ingestion';
export * from './schemas/analytics_engine';

export interface AuditLogItem {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  changesBefore: any;
  changesAfter: any;
  timestamp: string;
}

export interface DashboardStats {
  totalPorts: number;
  totalVessels: number;
  activeProcurementCount: number;
  totalImportJobsCount: number;
  recentImportJobs: Array<{
    id: string;
    filename: string;
    entityType: string;
    status: string;
    rowCount: number;
    uploadedAt: string;
  }>;
  recentProcurements: Array<{
    id: string;
    commodity: string;
    quantityMt: number;
    originPortName: string;
    destinationPortName: string;
    status: string;
    budgetInrCrore: number;
    requiredDeliveryDate: string;
  }>;
}
