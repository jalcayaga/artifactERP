import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ProductsService } from '../products/products.service'
import { SalesService } from '../sales/sales.service'
import { Order, Prisma } from '@prisma/client'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private salesService: SalesService
  ) { }

  async create(
    tenantId: string,
    createOrderDto: CreateOrderDto,
    authenticatedUserId: string
  ): Promise<Order> {
    await this.ensureUserBelongsToTenant(tenantId, createOrderDto.userId)
    await this.ensureUserBelongsToTenant(tenantId, authenticatedUserId)
    await this.ensureCompanyBelongsToTenant(tenantId, createOrderDto.companyId)

    // Transaction to create order and update lots
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Order and OrderItems (and OrderItemLots via nested write)
      const order = await tx.order.create({
        data: {
          tenant: { connect: { id: tenantId } },
          user: { connect: { id: authenticatedUserId } },
          company: { connect: { id: createOrderDto.companyId } },
          source: createOrderDto.source,
          status: createOrderDto.status,
          paymentStatus: createOrderDto.paymentStatus,
          subTotalAmount: new Prisma.Decimal(createOrderDto.subTotalAmount),
          vatAmount: new Prisma.Decimal(createOrderDto.vatAmount),
          grandTotalAmount: new Prisma.Decimal(createOrderDto.grandTotalAmount),
          vatRatePercent: createOrderDto.vatRatePercent,
          discountAmount: createOrderDto.discountAmount
            ? new Prisma.Decimal(createOrderDto.discountAmount)
            : undefined,
          shippingAmount: createOrderDto.shippingAmount
            ? new Prisma.Decimal(createOrderDto.shippingAmount)
            : undefined,
          currency: createOrderDto.currency,
          shippingAddress: createOrderDto.shippingAddress,
          billingAddress: createOrderDto.billingAddress,
          customerNotes: createOrderDto.customerNotes,
          paymentMethod: createOrderDto.paymentMethod,
          orderItems: {
            create: createOrderDto.items.map((item) => ({
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              totalPrice: new Prisma.Decimal(item.totalPrice),
              itemVatAmount: new Prisma.Decimal(item.itemVatAmount),
              totalPriceWithVat: new Prisma.Decimal(item.totalPriceWithVat),
              product: { connect: { id: item.productId } },
              orderItemLots:
                item.lots && item.lots.length > 0
                  ? {
                    create: item.lots.map((lot) => ({
                      lot: { connect: { id: lot.lotId } },
                      quantityTaken: lot.quantity,
                    })),
                  }
                  : undefined,
            })),
          },
        },
      })

      // 2. Decrement Lots
      for (const item of createOrderDto.items) {
        if (item.lots && item.lots.length > 0) {
          for (const lotInfo of item.lots) {
            await tx.lot.update({
              where: { id: lotInfo.lotId },
              data: {
                currentQuantity: { decrement: lotInfo.quantity },
              },
            })
          }
        }
      }

      return order
    })
  }

  async findAll(
    tenantId: string,
    page: number,
    limit: number,
    userId?: string
  ): Promise<{
    data: Order[]
    total: number
    pages: number
    currentPage: number
  }> {
    const where: Prisma.OrderWhereInput = { tenantId }
    if (userId) {
      where.userId = userId
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ])
    return { data, total, pages: Math.ceil(total / limit), currentPage: page }
  }

  async findOne(tenantId: string, id: string): Promise<Order | null> {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
      include: { orderItems: { include: { product: true } }, company: true },
    })
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`)
    }
    return order
  }

  async update(
    tenantId: string,
    id: string,
    updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    await this.ensureOrderBelongsToTenant(tenantId, id)
    const data: Prisma.OrderUpdateInput = {}

    if (updateOrderDto.status !== undefined) data.status = updateOrderDto.status
    if (updateOrderDto.paymentStatus !== undefined)
      data.paymentStatus = updateOrderDto.paymentStatus
    if (updateOrderDto.subTotalAmount !== undefined)
      data.subTotalAmount = new Prisma.Decimal(updateOrderDto.subTotalAmount)
    if (updateOrderDto.vatAmount !== undefined)
      data.vatAmount = new Prisma.Decimal(updateOrderDto.vatAmount)
    if (updateOrderDto.grandTotalAmount !== undefined)
      data.grandTotalAmount = new Prisma.Decimal(
        updateOrderDto.grandTotalAmount
      )
    if (updateOrderDto.vatRatePercent !== undefined)
      data.vatRatePercent = updateOrderDto.vatRatePercent
    if (updateOrderDto.discountAmount !== undefined)
      data.discountAmount = new Prisma.Decimal(updateOrderDto.discountAmount)
    if (updateOrderDto.shippingAmount !== undefined)
      data.shippingAmount = new Prisma.Decimal(updateOrderDto.shippingAmount)
    if (updateOrderDto.currency !== undefined)
      data.currency = updateOrderDto.currency
    if (updateOrderDto.shippingAddress !== undefined)
      data.shippingAddress = updateOrderDto.shippingAddress
    if (updateOrderDto.billingAddress !== undefined)
      data.billingAddress = updateOrderDto.billingAddress
    if (updateOrderDto.customerNotes !== undefined)
      data.customerNotes = updateOrderDto.customerNotes
    if (updateOrderDto.paymentMethod !== undefined)
      data.paymentMethod = updateOrderDto.paymentMethod

    if (updateOrderDto.userId !== undefined) {
      await this.ensureUserBelongsToTenant(tenantId, updateOrderDto.userId)
      data.user = { connect: { id: updateOrderDto.userId } }
    }
    if (updateOrderDto.companyId !== undefined) {
      await this.ensureCompanyBelongsToTenant(
        tenantId,
        updateOrderDto.companyId
      )
      data.company = { connect: { id: updateOrderDto.companyId } }
    }

    if (updateOrderDto.items !== undefined) {
      data.orderItems = {
        deleteMany: {},
        create: updateOrderDto.items.map((item) => ({
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
          product: { connect: { id: item.productId } },
        })),
      }
    }

    return this.prisma.order.update({
      where: { id },
      data,
    })
  }

  private async ensureUserBelongsToTenant(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    })
    if (!user) {
      throw new ForbiddenException(
        `User ${userId} does not belong to tenant ${tenantId}`
      )
    }
  }

  private async ensureCompanyBelongsToTenant(
    tenantId: string,
    companyId: string
  ) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, tenantId },
    })
    if (!company) {
      throw new ForbiddenException(
        `Company ${companyId} does not belong to tenant ${tenantId}`
      )
    }
  }

  private async ensureOrderBelongsToTenant(tenantId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
    })
    if (!order) {
      throw new ForbiddenException(
        `Order ${orderId} does not belong to tenant ${tenantId}`
      )
    }
  }
}
