import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CargoSchema, CargoInput } from '@freightiq/shared-types';

@Injectable()
export class CargoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cargo.findMany({
      include: {
        originPort: true,
        destinationPort: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const cargo = await this.prisma.cargo.findUnique({
      where: { id },
      include: {
        originPort: true,
        destinationPort: true
      }
    });
    if (!cargo) {
      throw new NotFoundException(`Cargo requirement ${id} not found`);
    }
    return cargo;
  }

  async create(data: CargoInput) {
    const validated = CargoSchema.parse(data);
    return this.prisma.cargo.create({
      data: {
        commodity: validated.commodity,
        quantityMt: validated.quantityMt,
        originPortId: validated.originPortId,
        destinationPortId: validated.destinationPortId,
        laycanStartDate: new Date(validated.laycanStartDate),
        laycanEndDate: new Date(validated.laycanEndDate),
        maxMoisturePct: validated.maxMoisturePct,
        maxAshPct: validated.maxAshPct
      },
      include: {
        originPort: true,
        destinationPort: true
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cargo.delete({ where: { id } });
  }
}
