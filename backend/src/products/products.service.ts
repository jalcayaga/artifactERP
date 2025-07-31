import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma, Lot } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    if (data.sku) {
      const existingBySku = await this.prisma.product.findUnique({ where: { sku: data.sku } });
      if (existingBySku) {
        throw new ConflictException('Product with this SKU already exists.');
      }
    }
    return this.prisma.product.create({ data });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findAllPaginated(page: number, limit: number) {
    const total = await this.prisma.product.count();
    const data = await this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return { data, total, pages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }

  async getLotsByProductId(productId: string): Promise<Lot[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { lots: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    return product.lots;
  }
}
