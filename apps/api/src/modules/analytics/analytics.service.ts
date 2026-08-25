import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DashboardStats } from '@freightiq/shared-types';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(user: any): Promise<DashboardStats> {
    const totalPorts = await this.prisma.port.count();
    const totalVessels = await this.prisma.vessel.count();

    const activeProcurementCount = await this.prisma.procurementRequest.count({
      where: { organizationId: user.organizationId }
    });

    const totalImportJobsCount = await this.prisma.dataImportJob.count({
      where: { organizationId: user.organizationId }
    });

    const recentImportJobs = await this.prisma.dataImportJob.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const recentProcurements = await this.prisma.procurementRequest.findMany({
      where: { organizationId: user.organizationId },
      include: {
        originPort: { select: { name: true } },
        destinationPort: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return {
      totalPorts,
      totalVessels,
      activeProcurementCount,
      totalImportJobsCount,
      recentImportJobs: recentImportJobs.map((j) => ({
        id: j.id,
        filename: j.filename,
        entityType: j.entityType,
        status: j.status,
        rowCount: j.rowCount,
        uploadedAt: j.createdAt.toISOString()
      })),
      recentProcurements: recentProcurements.map((p) => ({
        id: p.id,
        commodity: p.commodity,
        quantityMt: p.quantityMt,
        originPortName: p.originPort.name,
        destinationPortName: p.destinationPort.name,
        status: p.status,
        budgetInrCrore: p.budgetInrCrore,
        requiredDeliveryDate: p.requiredDeliveryDate.toISOString()
      }))
    };
  }
}
