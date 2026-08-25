import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { VesselSchema, VesselInput } from '@freightiq/shared-types';

@Injectable()
export class VesselsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { vesselTypeId?: string; status?: string; search?: string }) {
    const where: any = {};
    if (query?.vesselTypeId) {
      where.vesselTypeId = query.vesselTypeId;
    }
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { imoNumber: { contains: query.search, mode: 'insensitive' } }
      ];
    }
    return this.prisma.vessel.findMany({
      where,
      include: {
        vesselType: true
      },
      orderBy: { name: 'asc' }
    });
  }

  async getVesselTypes() {
    return this.prisma.vesselType.findMany({
      orderBy: { code: 'asc' }
    });
  }

  async findOne(id: string) {
    const vessel = await this.prisma.vessel.findUnique({
      where: { id },
      include: { vesselType: true }
    });
    if (!vessel) {
      throw new NotFoundException(`Vessel with ID ${id} not found`);
    }
    return vessel;
  }

  async create(data: VesselInput) {
    const validated = VesselSchema.parse(data);
    return this.prisma.vessel.create({
      data: validated,
      include: { vesselType: true }
    });
  }

  async update(id: string, data: Partial<VesselInput>) {
    await this.findOne(id);
    return this.prisma.vessel.update({
      where: { id },
      data,
      include: { vesselType: true }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.vessel.delete({
      where: { id }
    });
  }
}
