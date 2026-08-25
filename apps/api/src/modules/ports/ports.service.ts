import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PortSchema, PortInput } from '@freightiq/shared-types';

@Injectable()
export class PortsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { search?: string }) {
    const where: any = {};
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { country: { contains: query.search, mode: 'insensitive' } }
      ];
    }
    return this.prisma.port.findMany({
      where,
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string) {
    const port = await this.prisma.port.findUnique({
      where: { id }
    });
    if (!port) {
      throw new NotFoundException(`Port with ID ${id} not found`);
    }
    return port;
  }

  async create(data: PortInput) {
    const validated = PortSchema.parse(data);
    return this.prisma.port.create({
      data: validated
    });
  }

  async update(id: string, data: Partial<PortInput>) {
    await this.findOne(id);
    return this.prisma.port.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.port.delete({
      where: { id }
    });
  }
}
