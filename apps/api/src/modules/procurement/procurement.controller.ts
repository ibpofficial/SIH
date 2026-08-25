import { Controller, Get, Post, Body, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { Roles } from '../auth/roles.decorator';
import { CreateProcurementRequestInput } from '@freightiq/shared-types';

@Controller('procurement')
export class ProcurementController {
  constructor(private procurementService: ProcurementService) {}

  @Get('requests')
  async findAll(@Req() req: any) {
    return this.procurementService.findAll(req.user);
  }

  @Get('requests/:id')
  async findOne(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  @Post('requests')
  @Roles('ADMIN', 'PROCUREMENT_MANAGER')
  async create(@Body() body: CreateProcurementRequestInput, @Req() req: any) {
    return this.procurementService.create(body, req.user);
  }

  @Post('requests/:id/analyze')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST')
  async analyzeAndOptimize(@Param('id') id: string) {
    return this.procurementService.executeAnalysisPipeline(id);
  }

  @Post('requests/:id/simulate')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST')
  async simulateScenario(
    @Param('id') id: string,
    @Body() body: { rateShiftPct: number; handlingCapacityShiftPct: number; deadlineDaysShift: number }
  ) {
    return this.procurementService.simulateScenario(id, body);
  }
}
