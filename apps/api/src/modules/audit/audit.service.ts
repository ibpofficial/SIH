import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(data: {
    userId?: string;
    action: string;
    entityType: string;
    entityId: string;
    changesBefore?: any;
    changesAfter?: any;
  }) {
    let targetUserId = data.userId;
    if (!targetUserId) {
      const u = await this.prisma.user.findFirst();
      targetUserId = u?.id || 'system-user';
    }

    return this.prisma.auditLog.create({
      data: {
        userId: targetUserId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        changesBefore: data.changesBefore ? JSON.stringify(data.changesBefore) : null,
        changesAfter: data.changesAfter ? JSON.stringify(data.changesAfter) : null
      }
    });
  }

  async findAll(query: { entityType?: string; userId?: string; limit?: number }) {
    const where: any = {};
    if (query.entityType) {
      where.entityType = { contains: query.entityType, mode: 'insensitive' };
    }
    if (query.userId) {
      where.userId = query.userId;
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      take: query.limit || 50,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true
          }
        }
      }
    });

    return logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      userEmail: log.user.email,
      userFullName: log.user.fullName,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      changesBefore: log.changesBefore,
      changesAfter: log.changesAfter,
      timestamp: log.timestamp.toISOString()
    }));
  }
}
