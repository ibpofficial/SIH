import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { VesselsService } from './vessels.service';
import { Roles } from '../auth/roles.decorator';
import { VesselInput } from '@freightiq/shared-types';

@Controller('vessels')
export class VesselsController {
  constructor(private vesselsService: VesselsService) {}

  @Get()
  async findAll(
    @Query('vesselTypeId') vesselTypeId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.vesselsService.findAll({ vesselTypeId, status, search });
  }

  @Get('types')
  async getVesselTypes() {
    return this.vesselsService.getVesselTypes();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vesselsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'PROCUREMENT_MANAGER')
  async create(@Body() body: VesselInput) {
    return this.vesselsService.create(body);
  }

  @Put(':id')
  @Roles('ADMIN', 'PROCUREMENT_MANAGER')
  async update(@Param('id') id: string, @Body() body: Partial<VesselInput>) {
    return this.vesselsService.update(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.vesselsService.remove(id);
  }
}
