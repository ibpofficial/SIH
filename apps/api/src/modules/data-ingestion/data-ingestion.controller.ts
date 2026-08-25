import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Res,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DataIngestionService } from './data-ingestion.service';
import { Roles } from '../auth/roles.decorator';
import { IngestionEntityType } from '@freightiq/shared-types';

@Controller('data-ingestion')
export class DataIngestionController {
  constructor(private ingestionService: DataIngestionService) {}

  @Post('upload')
  @Roles('ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('entityType') entityType: IngestionEntityType,
    @Req() req: any
  ) {
    if (!file) {
      throw new BadRequestException('File is required for upload');
    }
    if (!entityType) {
      throw new BadRequestException('entityType is required (FREIGHT_RATE, VESSEL, PORT, CARGO)');
    }

    return this.ingestionService.parseAndValidate(file, entityType, req.user);
  }

  @Post('commit/:jobId')
  @Roles('ADMIN', 'PROCUREMENT_MANAGER')
  async commitJob(@Param('jobId') jobId: string, @Req() req: any) {
    return this.ingestionService.commitJob(jobId, req.user);
  }

  @Get('download-errors/:jobId')
  @Roles('ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST')
  async downloadErrorCsv(@Param('jobId') jobId: string, @Res() res: Response) {
    const csvData = await this.ingestionService.generateErrorCsv(jobId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="job-${jobId}-errors.csv"`);
    res.send(csvData);
  }

  @Get('history')
  async getHistory() {
    return this.ingestionService.getImportHistory();
  }
}
