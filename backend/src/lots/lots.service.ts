import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Lot, Prisma } from '@prisma/client';

@Injectable()
export class LotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Lot[]> {
    return this.prisma.lot.findMany();
  }

  async findOne(id: string): Promise<Lot | null> {
    return this.prisma.lot.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.LotUpdateInput): Promise<Lot> {
    const lot = await this.prisma.lot.findUnique({ where: { id } });
    if (!lot) {
      throw new NotFoundException(`Lot with ID ${id} not found.`);
    }
    return this.prisma.lot.update({ where: { id }, data });
  }
}