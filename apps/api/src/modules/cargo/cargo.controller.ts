import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { Roles } from '../auth/roles.decorator';
import { CargoInput } from '@freightiq/shared-types';

@Controller('cargo')
export class CargoController {
  constructor(private cargoService: CargoService) {}

  @Get()
  async findAll() {
    return this.cargoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cargoService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'PROCUREMENT_MANAGER')
  async create(@Body() body: CargoInput) {
    return this.cargoService.create(body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.cargoService.remove(id);
  }
}
