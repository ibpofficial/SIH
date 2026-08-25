import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';
import { AuditModule } from './modules/audit/audit.module';
import { AuditInterceptor } from './modules/audit/audit.interceptor';
import { DataIngestionModule } from './modules/data-ingestion/data-ingestion.module';
import { PortsModule } from './modules/ports/ports.module';
import { VesselsModule } from './modules/vessels/vessels.module';
import { CargoModule } from './modules/cargo/cargo.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PlaceholderModule } from './modules/placeholder/placeholder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AuditModule,
    DataIngestionModule,
    PortsModule,
    VesselsModule,
    CargoModule,
    ProcurementModule,
    UsersModule,
    OrganizationsModule,
    AnalyticsModule,
    PlaceholderModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor
    }
  ]
})
export class AppModule {}
