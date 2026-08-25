import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PortsService } from './ports.service';
import { Roles } from '../auth/roles.decorator';
import { PortInput } from '@freightiq/shared-types';

@Controller('ports')
export class PortsController {
  constructor(private portsService: PortsService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.portsService.findAll({ search });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.portsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'PROCUREMENT_MANAGER')
  async create(@Body() body: PortInput) {
    return this.portsService.create(body);
  }

  @Put(':id')
  @Roles('ADMIN', 'PROCUREMENT_MANAGER')
  async update(@Param('id') id: string, @Body() body: Partial<PortInput>) {
    return this.portsService.update(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.portsService.remove(id);
  }
}
