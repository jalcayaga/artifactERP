import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, authenticatedUserId: string): Promise<Order> {
    return this.prisma.order.create({
      data: {
        user: { connect: { id: authenticatedUserId } },
        company: { connect: { id: createOrderDto.companyId } },
        status: createOrderDto.status,
        paymentStatus: createOrderDto.paymentStatus,
        subTotalAmount: createOrderDto.subTotalAmount,
        vatAmount: createOrderDto.vatAmount,
        grandTotalAmount: createOrderDto.grandTotalAmount,
        vatRatePercent: createOrderDto.vatRatePercent,
        discountAmount: createOrderDto.discountAmount,
        shippingAmount: createOrderDto.shippingAmount,
        currency: createOrderDto.currency,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress,
        customerNotes: createOrderDto.customerNotes,
        paymentMethod: createOrderDto.paymentMethod,
        orderItems: {
          create: createOrderDto.items.map(item => ({
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
  }

  async findAll(page: number, limit: number, userId: string): Promise<{ data: Order[], total: number, pages: number, currentPage: number }> {
    const where: Prisma.OrderWhereInput = { userId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.order.count({ where }),
    ]);
    return { data, total, pages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id }, include: { orderItems: { include: { product: true } }, company: true } });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const data: Prisma.OrderUpdateInput = {};

    if (updateOrderDto.status !== undefined) data.status = updateOrderDto.status;
    if (updateOrderDto.paymentStatus !== undefined) data.paymentStatus = updateOrderDto.paymentStatus;
    if (updateOrderDto.subTotalAmount !== undefined) data.subTotalAmount = updateOrderDto.subTotalAmount;
    if (updateOrderDto.vatAmount !== undefined) data.vatAmount = updateOrderDto.vatAmount;
    if (updateOrderDto.grandTotalAmount !== undefined) data.grandTotalAmount = updateOrderDto.grandTotalAmount;
    if (updateOrderDto.vatRatePercent !== undefined) data.vatRatePercent = updateOrderDto.vatRatePercent;
    if (updateOrderDto.discountAmount !== undefined) data.discountAmount = updateOrderDto.discountAmount;
    if (updateOrderDto.shippingAmount !== undefined) data.shippingAmount = updateOrderDto.shippingAmount;
    if (updateOrderDto.currency !== undefined) data.currency = updateOrderDto.currency;
    if (updateOrderDto.shippingAddress !== undefined) data.shippingAddress = updateOrderDto.shippingAddress;
    if (updateOrderDto.billingAddress !== undefined) data.billingAddress = updateOrderDto.billingAddress;
    if (updateOrderDto.customerNotes !== undefined) data.customerNotes = updateOrderDto.customerNotes;
    if (updateOrderDto.paymentMethod !== undefined) data.paymentMethod = updateOrderDto.paymentMethod;

    if (updateOrderDto.userId !== undefined) {
      data.user = { connect: { id: updateOrderDto.userId } };
    }
    if (updateOrderDto.companyId !== undefined) {
      data.company = { connect: { id: updateOrderDto.companyId } };
    }

    if (updateOrderDto.items !== undefined) {
      data.orderItems = {
        deleteMany: {},
        create: updateOrderDto.items.map(item => ({
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
          product: { connect: { id: item.productId } },
        })),
      };
    }

    return this.prisma.order.update({
      where: { id },
      data,
    });
  }
}
