import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateQuoteDto } from './dto/create-quote.dto'
import { UpdateQuoteDto } from './dto/update-quote.dto'
import { Prisma, ProductType, Quote, QuoteStatus } from '@prisma/client'

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(
    tenantId: string,
    createQuoteDto: CreateQuoteDto,
    userId: string
  ): Promise<Quote> {
    const { items, companyId, ...quoteData } = createQuoteDto

    return this.prisma.$transaction(async (tx) => {
      await this.ensureUserBelongsToTenant(tenantId, userId)
      await this.ensureCompanyBelongsToTenant(tenantId, companyId)

      const company = await tx.company.findFirst({
        where: { id: companyId, tenantId },
      })
      if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found.`)
      }

      const quoteItemsCreateData = []
      for (const itemDto of items) {
        const product = await this.prisma.product.findFirst({
          where: { id: itemDto.productId, tenantId },
        })
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${itemDto.productId} not found.`
          )
        }
        if (
          product.productType !== ProductType.PRODUCT &&
          product.productType !== ProductType.SERVICE
        ) {
          throw new BadRequestException(
            `Product ${product.name} is not a valid product type for a quote.`
          )
        }
        quoteItemsCreateData.push({
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          unitPrice: new Prisma.Decimal(itemDto.unitPrice),
          totalPrice: new Prisma.Decimal(itemDto.totalPrice),
          itemVatAmount: new Prisma.Decimal(itemDto.itemVatAmount),
          totalPriceWithVat: new Prisma.Decimal(itemDto.totalPriceWithVat),
        })
      }

      return tx.quote.create({
        data: {
          tenant: { connect: { id: tenantId } },
          ...quoteData,
          company: { connect: { id: companyId } },
          user: { connect: { id: userId } },
          subTotalAmount: new Prisma.Decimal(quoteData.subTotalAmount),
          vatAmount: new Prisma.Decimal(quoteData.vatAmount),
          grandTotal: new Prisma.Decimal(quoteData.grandTotal),
          quoteItems: { create: quoteItemsCreateData },
        },
        include: { quoteItems: { include: { product: true } }, company: true },
      })
    })
  }

  async findAll(
    tenantId: string,
    page: number,
    limit: number,
    status?: QuoteStatus
  ): Promise<{
    data: Quote[]
    total: number
    pages: number
    currentPage: number
  }> {
    const where: Prisma.QuoteWhereInput = { tenantId }
    if (status) {
      where.status = status
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { company: true, quoteItems: { include: { product: true } } },
      }),
      this.prisma.quote.count({ where }),
    ])
    return { data, total, pages: Math.ceil(total / limit), currentPage: page }
  }

  async findOne(tenantId: string, id: string): Promise<Quote> {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId },
      include: { company: true, quoteItems: { include: { product: true } } },
    })
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found.`)
    }
    return quote
  }

  async update(
    tenantId: string,
    id: string,
    updateQuoteDto: UpdateQuoteDto,
    userId: string
  ): Promise<Quote> {
    await this.ensureQuoteBelongsToTenant(tenantId, id)
    await this.ensureUserBelongsToTenant(tenantId, userId)
    const { items, companyId, ...quoteData } = updateQuoteDto
    if (companyId) {
      await this.ensureCompanyBelongsToTenant(tenantId, companyId)
    }

    return this.prisma.quote.update({
      where: { id },
      data: {
        ...quoteData,
        ...(companyId && { company: { connect: { id: companyId } } }),
        ...(items && {
          quoteItems: {
            deleteMany: {},
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(item.unitPrice),
              totalPrice: new Prisma.Decimal(item.totalPrice),
              itemVatAmount: new Prisma.Decimal(item.itemVatAmount),
              totalPriceWithVat: new Prisma.Decimal(item.totalPriceWithVat),
            })),
          },
        }),
      },
    })
  }

  async remove(tenantId: string, id: string): Promise<Quote> {
    await this.ensureQuoteBelongsToTenant(tenantId, id)
    return this.prisma.quote.delete({ where: { id } })
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

  private async ensureQuoteBelongsToTenant(tenantId: string, quoteId: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id: quoteId, tenantId },
    })
    if (!quote) {
      throw new ForbiddenException(
        `Quote ${quoteId} does not belong to tenant ${tenantId}`
      )
    }
  }
}
