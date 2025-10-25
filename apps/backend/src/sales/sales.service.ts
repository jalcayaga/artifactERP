import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma, OrderStatus } from '@prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      const { items, companyId, userId, ...orderData } = createSaleDto;
      const newOrder = await tx.order.create({
        data: {
          ...orderData,
          company: { connect: { id: companyId } },
          user: { connect: { id: userId } },
          orderItems: {
            create: items.map(item => ({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              itemVatAmount: item.itemVatAmount,
              totalPriceWithVat: item.totalPriceWithVat,
              product: { connect: { id: item.productId } },
            })),
          },
        },
      });
      return newOrder;
    });
  }

  async findAll(page: number, limit: number, filters: any) {
    const whereClause: Prisma.OrderWhereInput = {};
    if (filters.status) {
      whereClause.status = filters.status;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { company: true, orderItems: true },
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    return { data, total, pages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { company: true, orderItems: { include: { product: true } } },
    });
  }
}