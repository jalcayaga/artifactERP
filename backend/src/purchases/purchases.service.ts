import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Purchase, Prisma } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PurchaseCreateInput): Promise<Purchase> {
    return this.prisma.purchase.create({ data });
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.purchase.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { purchaseDate: 'desc' },
        include: { supplier: true, items: true },
      }),
      this.prisma.purchase.count(),
    ]);
    return { data, total, pages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string): Promise<Purchase | null> {
    return this.prisma.purchase.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { product: true } } },
    });
  }

  async update(id: string, data: Prisma.PurchaseUpdateInput): Promise<Purchase> {
    return this.prisma.purchase.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Purchase> {
    return this.prisma.purchase.delete({ where: { id } });
  }
}