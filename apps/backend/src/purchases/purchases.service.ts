import { Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Purchase, Prisma } from '@prisma/client'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, data: CreatePurchaseDto): Promise<Purchase> {
    await this.ensureCompanyBelongsToTenant(tenantId, data.companyId)

    return this.prisma.purchase.create({
      data: {
        tenant: { connect: { id: tenantId } },
        company: { connect: { id: data.companyId } },
        purchaseDate: new Date(data.purchaseDate),
        subTotalAmount: new Prisma.Decimal(data.subTotalAmount),
        totalVatAmount: new Prisma.Decimal(data.totalVatAmount),
        grandTotal: new Prisma.Decimal(data.grandTotal),
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            totalPrice: new Prisma.Decimal(item.totalPrice),
            itemVatAmount: new Prisma.Decimal(item.itemVatAmount),
            totalPriceWithVat: new Prisma.Decimal(item.totalPriceWithVat),
          })),
        },
      },
      include: { company: true, items: true },
    })
  }

  async findAll(tenantId: string, page: number, limit: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.purchase.findMany({
        where: { tenantId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { purchaseDate: 'desc' },
        include: { company: true, items: true },
      }),
      this.prisma.purchase.count({ where: { tenantId } }),
    ])
    return { data, total, pages: Math.ceil(total / limit), currentPage: page }
  }

  async findOne(tenantId: string, id: string): Promise<Purchase | null> {
    return this.prisma.purchase.findFirst({
      where: { id, tenantId },
      include: { company: true, items: { include: { product: true } } },
    })
  }

  async update(
    tenantId: string,
    id: string,
    dto: UpdatePurchaseDto
  ): Promise<Purchase> {
    await this.ensurePurchaseBelongsToTenant(tenantId, id)

    const { items, companyId, ...purchaseData } = dto

    const data: Prisma.PurchaseUpdateInput = {
      ...purchaseData,
    }

    if (purchaseData.purchaseDate) {
      data.purchaseDate = new Date(purchaseData.purchaseDate)
    }

    if (purchaseData.subTotalAmount !== undefined) {
      data.subTotalAmount = new Prisma.Decimal(purchaseData.subTotalAmount)
    }
    if (purchaseData.totalVatAmount !== undefined) {
      data.totalVatAmount = new Prisma.Decimal(purchaseData.totalVatAmount)
    }
    if (purchaseData.grandTotal !== undefined) {
      data.grandTotal = new Prisma.Decimal(purchaseData.grandTotal)
    }

    if (companyId) {
      await this.ensureCompanyBelongsToTenant(tenantId, companyId)
      data.company = { connect: { id: companyId } }
    }

    if (items) {
      data.items = {
        deleteMany: {},
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(item.unitPrice),
          totalPrice: new Prisma.Decimal(item.totalPrice),
          itemVatAmount: new Prisma.Decimal(item.itemVatAmount),
          totalPriceWithVat: new Prisma.Decimal(item.totalPriceWithVat),
        })),
      }
    }

    return this.prisma.purchase.update({
      where: { id },
      data,
      include: { company: true, items: true },
    })
  }

  async remove(tenantId: string, id: string): Promise<Purchase> {
    await this.ensurePurchaseBelongsToTenant(tenantId, id)
    return this.prisma.purchase.delete({ where: { id } })
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

  private async ensurePurchaseBelongsToTenant(
    tenantId: string,
    purchaseId: string
  ) {
    const purchase = await this.prisma.purchase.findFirst({
      where: { id: purchaseId, tenantId },
    })
    if (!purchase) {
      throw new ForbiddenException(
        `Purchase ${purchaseId} does not belong to tenant ${tenantId}`
      )
    }
  }
}
