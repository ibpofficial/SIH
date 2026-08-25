import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IngestionValidationService } from './ingestion-validation.service';
import { IngestionEntityType, DataImportJobSummary } from '@freightiq/shared-types';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

@Injectable()
export class DataIngestionService {
  constructor(
    private prisma: PrismaService,
    private validationService: IngestionValidationService
  ) {}

  async parseAndValidate(
    file: Express.Multer.File,
    entityType: IngestionEntityType,
    user: any
  ): Promise<DataImportJobSummary> {
    let parsedRows: any[] = [];

    const fileExt = file.originalname.split('.').pop()?.toLowerCase();
    if (fileExt === 'csv') {
      const csvText = file.buffer.toString('utf-8');
      const parseResult = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      parsedRows = parseResult.data;
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      parsedRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      throw new BadRequestException('Unsupported file format. Please upload CSV or XLSX file.');
    }

    if (!parsedRows || parsedRows.length === 0) {
      throw new BadRequestException('Uploaded file is empty or contains no readable rows');
    }

    const { validRows, errors, warningCount } = await this.validationService.validateRows(
      entityType,
      parsedRows
    );

    const status = errors.length === 0 ? 'VALIDATED' : validRows.length > 0 ? 'VALIDATED' : 'FAILED';

    const job = await this.prisma.dataImportJob.create({
      data: {
        filename: file.originalname,
        entityType,
        status: status as any,
        rowCount: parsedRows.length,
        validRowCount: validRows.length,
        errorCount: errors.length,
        warningCount,
        errorsJson: errors as any,
        stagedRowsJson: validRows as any,
        uploadedById: user.id,
        organizationId: user.organizationId
      }
    });

    return {
      id: job.id,
      filename: job.filename,
      entityType: job.entityType as IngestionEntityType,
      status: job.status as any,
      rowCount: job.rowCount,
      validRowCount: job.validRowCount,
      errorCount: job.errorCount,
      warningCount: job.warningCount,
      errors: (job.errorsJson as any) || [],
      uploadedBy: user.fullName || user.email,
      uploadedAt: job.createdAt.toISOString()
    };
  }

  async commitJob(jobId: string, user: any) {
    const job = await this.prisma.dataImportJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new NotFoundException('Data import job not found');
    }

    if (job.status === 'COMMITTED') {
      throw new BadRequestException('This import job has already been committed to the database');
    }

    const stagedRows = job.stagedRowsJson ? JSON.parse(job.stagedRowsJson) : [];
    if (stagedRows.length === 0) {
      throw new BadRequestException('No valid rows available to commit for this job');
    }

    if (job.entityType === 'FREIGHT_RATE') {
      await this.prisma.freightRate.createMany({
        data: stagedRows.map((r) => ({
          originPortId: r.originPortId,
          destinationPortId: r.destinationPortId,
          vesselTypeId: r.vesselTypeId,
          cargoType: r.cargoType,
          rateUsdPerMt: r.rateUsdPerMt,
          rateDate: new Date(r.rateDate)
        }))
      });
    } else if (job.entityType === 'VESSEL') {
      for (const row of stagedRows) {
        await this.prisma.vessel.upsert({
          where: { imoNumber: row.imoNumber },
          update: row,
          create: row
        });
      }
    } else if (job.entityType === 'PORT') {
      for (const row of stagedRows) {
        await this.prisma.port.upsert({
          where: { code: row.code },
          update: row,
          create: row
        });
      }
    } else if (job.entityType === 'CARGO') {
      await this.prisma.cargo.createMany({
        data: stagedRows
      });
    }

    const updatedJob = await this.prisma.dataImportJob.update({
      where: { id: jobId },
      data: { status: 'COMMITTED' }
    });

    return {
      message: `Successfully committed ${job.validRowCount} records to primary database`,
      jobId: updatedJob.id,
      committedCount: job.validRowCount
    };
  }

  async generateErrorCsv(jobId: string): Promise<string> {
    const job = await this.prisma.dataImportJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new NotFoundException('Import job not found');
    }

    const errors = job.errorsJson ? JSON.parse(job.errorsJson) : [];
    const csvRows = errors.map((err) => ({
      RowNumber: err.rowNumber,
      StageNumber: err.stage,
      StageName: err.stageName,
      ColumnName: err.column || 'N/A',
      InvalidValue: err.value !== undefined ? String(err.value) : 'N/A',
      FailureReason: err.reason
    }));

    return Papa.unparse(csvRows);
  }

  async getImportHistory() {
    const jobs = await this.prisma.dataImportJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        uploadedBy: { select: { fullName: true, email: true } }
      }
    });

    return jobs.map((job) => ({
      id: job.id,
      filename: job.filename,
      entityType: job.entityType,
      status: job.status,
      rowCount: job.rowCount,
      validRowCount: job.validRowCount,
      errorCount: job.errorCount,
      warningCount: job.warningCount,
      uploadedBy: job.uploadedBy.fullName || job.uploadedBy.email,
      uploadedAt: job.createdAt.toISOString()
    }));
  }
}
