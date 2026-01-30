import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Lot, Prisma } from '@prisma/client'

@Injectable()
export class LotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string): Promise<Lot[]> {
    return this.prisma.lot.findMany({
      where: { tenantId },
      include: { product: true },
    })
  }

  async findOne(tenantId: string, id: string): Promise<Lot> {
    const lot = await this.prisma.lot.findFirst({
      where: { id, tenantId },
      include: { product: true },
    })
    if (!lot) {
      throw new NotFoundException(`Lot with ID ${id} not found.`)
    }
    return lot
  }

  async update(
    tenantId: string,
    id: string,
    data: Prisma.LotUpdateInput
  ): Promise<Lot> {
    const lot = await this.prisma.lot.findFirst({ where: { id, tenantId } })
    if (!lot) {
      throw new NotFoundException(`Lot with ID ${id} not found.`)
    }
    return this.prisma.lot.update({ where: { id }, data })
  }
}
