import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Order, OrderStatus, Prisma } from '@prisma/client'
import { CreateSaleDto } from './dto/create-sale.dto'
import { UpdateSaleDto } from './dto/update-sale.dto'
import { ProductsService } from '../products/products.service'

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService
  ) { }

  async create(tenantId: string, createSaleDto: CreateSaleDto): Promise<Order> {
    const { items, companyId, userId, ...orderData } = createSaleDto
    await this.ensureCompanyBelongsToTenant(tenantId, companyId)
    await this.ensureUserBelongsToTenant(tenantId, userId)

    return this.prisma.$transaction(async (tx) => {
      // 1. Process items (Reserve Stock)
      const orderItemsData = []

      for (const item of items) {
        const allocations = await this.productsService.reserveStock(
          tenantId,
          item.productId,
          item.quantity,
          tx
        )

        orderItemsData.push({
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemVatAmount: item.itemVatAmount,
          totalPriceWithVat: item.totalPriceWithVat,
          product: { connect: { id: item.productId } },
          orderItemLots: {
            create: allocations.map(alloc => ({
              lotId: alloc.lotId,
              quantityTaken: alloc.quantity
            }))
          }
        })
      }

      // 2. Create Order
      const { posShiftId, ...cleanOrderData } = orderData;
      const newOrder = await tx.order.create({
        data: {
          tenant: { connect: { id: tenantId } },
          ...cleanOrderData,
          company: { connect: { id: companyId } },
          user: { connect: { id: userId } },
          ...(posShiftId && { posShift: { connect: { id: posShiftId } } }),
          orderItems: {
            create: orderItemsData,
          },
        },
        include: { company: true, orderItems: { include: { product: true } } },
      })
      return newOrder
    })
  }

  async findAll(
    tenantId: string,
    page: number,
    limit: number,
    filters: { status?: string } = {}
  ) {
    const whereClause: Prisma.OrderWhereInput = { tenantId }
    if (filters.status) {
      whereClause.status = filters.status as OrderStatus
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { company: true },
      }),
      this.prisma.order.count({ where: whereClause }),
    ])

    return { data, total, pages: Math.ceil(total / limit), currentPage: page }
  }

  async findOne(tenantId: string, id: string): Promise<Order | null> {
    return this.prisma.order.findFirst({
      where: { id, tenantId },
      include: { company: true, orderItems: { include: { product: true } } },
    })
  }

  async update(
    tenantId: string,
    id: string,
    updateSaleDto: UpdateSaleDto
  ): Promise<Order> {
    await this.ensureSaleBelongsToTenant(tenantId, id)

    const { items, companyId, userId, ...orderData } = updateSaleDto

    const data: Prisma.OrderUpdateInput = {}

    if (orderData.status !== undefined) {
      data.status = orderData.status
    }
    if (orderData.paymentStatus !== undefined) {
      data.paymentStatus = orderData.paymentStatus
    }
    if (orderData.subTotalAmount !== undefined) {
      data.subTotalAmount = new Prisma.Decimal(orderData.subTotalAmount)
    }
    if (orderData.vatAmount !== undefined) {
      data.vatAmount = new Prisma.Decimal(orderData.vatAmount)
    }
    if (orderData.discountAmount !== undefined) {
      data.discountAmount = new Prisma.Decimal(orderData.discountAmount)
    }
    if (orderData.shippingAmount !== undefined) {
      data.shippingAmount = new Prisma.Decimal(orderData.shippingAmount)
    }
    if (orderData.grandTotalAmount !== undefined) {
      data.grandTotalAmount = new Prisma.Decimal(orderData.grandTotalAmount)
    }
    if (orderData.vatRatePercent !== undefined) {
      data.vatRatePercent = orderData.vatRatePercent
    }
    if (orderData.currency !== undefined) {
      data.currency = orderData.currency
    }
    if (orderData.customerNotes !== undefined) {
      data.customerNotes = orderData.customerNotes
    }
    if (orderData.paymentMethod !== undefined) {
      data.paymentMethod = orderData.paymentMethod
    }
    if (orderData.shippingAddress !== undefined) {
      data.shippingAddress = orderData.shippingAddress
    }
    if (orderData.billingAddress !== undefined) {
      data.billingAddress = orderData.billingAddress
    }

    if (companyId) {
      await this.ensureCompanyBelongsToTenant(tenantId, companyId)
      data.company = { connect: { id: companyId } }
    }

    if (userId) {
      await this.ensureUserBelongsToTenant(tenantId, userId)
      data.user = { connect: { id: userId } }
    }

    if (items) {
      data.orderItems = {
        deleteMany: {},
        create: items.map((item) => ({
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
      include: { company: true, orderItems: { include: { product: true } } },
    })
  }

  async remove(tenantId: string, id: string): Promise<Order> {
    await this.ensureSaleBelongsToTenant(tenantId, id)
    return this.prisma.order.delete({
      where: { id },
      include: { company: true, orderItems: { include: { product: true } } },
    })
  }

  private async ensureSaleBelongsToTenant(tenantId: string, saleId: string) {
    const sale = await this.prisma.order.findFirst({
      where: { id: saleId, tenantId },
    })
    if (!sale) {
      throw new ForbiddenException(
        `Order ${saleId} does not belong to tenant ${tenantId}`
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

  async createGuestSale(tenantId: string, guestData: any): Promise<Order> {
    const { items, customer } = guestData

    // 1. Find a Default User (Admin) to assign this sale to
    // Since Order requires userId, we assign it to the tenant owner/admin
    const defaultUser = await this.prisma.user.findFirst({
      where: { tenantId, roles: { some: { name: { in: ['SUPERADMIN', 'ADMIN'] } } } }
    });

    if (!defaultUser) {
      throw new ForbiddenException('No admin user found to assign guest sale');
    }

    // 2. Find or Create the Client Company
    let client = await this.prisma.company.findFirst({
      where: { tenantId, email: customer.email }
    });

    if (!client) {
      client = await this.prisma.company.create({
        data: {
          tenant: { connect: { id: tenantId } },
          user: { connect: { id: defaultUser.id } }, // Managed by Admin
          name: customer.name || 'Invitado Web',
          email: customer.email,
          rut: customer.rut,
          address: customer.address,
          city: customer.city,
          isClient: true
        }
      });
    }

    // 3. Prepare Order Data
    return this.prisma.$transaction(async (tx) => {
      const orderItemsData = []

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) continue;

        orderItemsData.push({
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: product.price.mul(item.quantity),
          itemVatAmount: product.price.mul(item.quantity).mul(0.19),
          totalPriceWithVat: product.price.mul(item.quantity).mul(1.19),
          product: { connect: { id: product.id } }
        });
      }

      const subTotal = orderItemsData.reduce((sum, i) => sum.add(i.totalPrice), new Prisma.Decimal(0));
      const vatAmount = subTotal.mul(0.19);
      const grandTotal = subTotal.add(vatAmount);

      // 4. Create Order
      const newOrder = await tx.order.create({
        data: {
          tenant: { connect: { id: tenantId } },
          company: { connect: { id: client!.id } },
          user: { connect: { id: defaultUser.id } },
          status: 'PENDING_PAYMENT',
          paymentStatus: 'PENDING',
          subTotalAmount: subTotal,
          vatAmount: vatAmount,
          grandTotalAmount: grandTotal,
          shippingAddress: customer.address + ', ' + customer.city,
          customerNotes: `Venta Web - Documento: ${customer.documentType}`,
          orderItems: {
            create: orderItemsData
          }
        },
        include: { company: true, orderItems: { include: { product: true } } }
      });

      // TODO: Generate Payment Link Here if needed

      return newOrder;
    }, {
      maxWait: 5000, // default: 2000
      timeout: 20000 // default: 5000
    });
  }
}
