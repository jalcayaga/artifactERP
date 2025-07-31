import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Prisma, ProductType, Quote } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class QuotesService {
  constructor(
    private prisma: PrismaService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
  ) {}

  async create(createQuoteDto: CreateQuoteDto, userId: string): Promise<Quote> {
    const { items, clientId, ...quoteData } = createQuoteDto;

    return this.prisma.$transaction(async (tx) => {
      const client = await this.clientsService.findOne(clientId, userId);
      if (!client) {
        throw new NotFoundException(`Client with ID ${clientId} not found.`);
      }

      const quoteItemsCreateData = [];
      for (const itemDto of items) {
        const product = await this.productsService.findOne(itemDto.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${itemDto.productId} not found.`);
        }
        if (product.productType !== ProductType.PRODUCT && product.productType !== ProductType.SERVICE) {
          throw new BadRequestException(`Product ${product.name} is not a valid product type for a quote.`);
        }
        quoteItemsCreateData.push({
          productId: itemDto.productId,
          quantity: itemDto.quantity,
          unitPrice: new Prisma.Decimal(itemDto.unitPrice),
          totalPrice: new Prisma.Decimal(itemDto.totalPrice),
          itemVatAmount: new Prisma.Decimal(itemDto.itemVatAmount),
          totalPriceWithVat: new Prisma.Decimal(itemDto.totalPriceWithVat),
        });
      }

      return tx.quote.create({
        data: {
          ...quoteData,
          client: { connect: { id: clientId } },
          user: { connect: { id: userId } },
          subTotalAmount: new Prisma.Decimal(quoteData.subTotalAmount),
          vatAmount: new Prisma.Decimal(quoteData.vatAmount),
          grandTotal: new Prisma.Decimal(quoteData.grandTotal),
          quoteItems: { create: quoteItemsCreateData },
        },
        include: { quoteItems: { include: { product: true } }, client: true },
      });
    });
  }

  async findAll(page: number, limit: number): Promise<{ data: Quote[]; total: number; pages: number; currentPage: number }> {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { client: true, quoteItems: { include: { product: true } } },
      }),
      this.prisma.quote.count(),
    ]);
    return { data, total, pages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string): Promise<Quote> {
    const quote = await this.prisma.quote.findUnique({ where: { id }, include: { client: true, quoteItems: { include: { product: true } } } });
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found.`);
    }
    return quote;
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto, userId: string): Promise<Quote> {
    // Simplified update logic
    const { items, clientId, ...quoteData } = updateQuoteDto;
    return this.prisma.quote.update({
      where: { id },
      data: { ...quoteData, client: { connect: { id: clientId } } },
    });
  }

  async remove(id: string): Promise<Quote> {
    return this.prisma.quote.delete({ where: { id } });
  }
}