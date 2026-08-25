import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;

    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
      return next.handle();
    }

    const pathParts = url.split('?')[0].split('/').filter(Boolean);
    const entityType = pathParts[2] ? pathParts[2].slice(0, -1).toUpperCase() : 'UNKNOWN';

    return next.handle().pipe(
      tap(async (responseResult) => {
        if (user && user.id) {
          const entityId = responseResult?.id || body?.id || 'N/A';
          try {
            await this.prisma.auditLog.create({
              data: {
                userId: user.id,
                action: `${method}_${entityType}`,
                entityType: entityType,
                entityId: String(entityId),
                changesBefore: body ? JSON.stringify({ payload: body }) : null,
                changesAfter: responseResult ? JSON.stringify({ result: responseResult }) : null,
                timestamp: new Date()
              }
            });
          } catch (err) {
            console.error('Failed to log audit record:', err);
          }
        }
      })
    );
  }
}
