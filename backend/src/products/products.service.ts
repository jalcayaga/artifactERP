import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma, Lot } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

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

  async findPublished(page: number, limit: number, category?: string) {
    const where: Prisma.ProductWhereInput = {
      isPublished: true,
    };
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const total = await this.prisma.product.count({ where });
    const data = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return { data, total, pages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async getAverageCost(id: string): Promise<{ averageCost: number }> {
    const lots = await this.prisma.lot.findMany({
      where: { productId: id, currentQuantity: { gt: 0 } },
    });

    if (lots.length === 0) {
      return { averageCost: 0 };
    }

    let totalCost = 0;
    let totalQuantity = 0;

    lots.forEach(lot => {
      totalCost += Number(lot.purchasePrice) * lot.currentQuantity;
      totalQuantity += lot.currentQuantity;
    });

    const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;

    return { averageCost };
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async updateTechnicalSheet(id: string, filename: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return this.prisma.product.update({
      where: { id },
      data: { technicalSheetUrl: `/uploads/${filename}` },
    });
  }

  async deleteTechnicalSheet(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || !product.technicalSheetUrl) {
      throw new NotFoundException(`Product or technical sheet not found for ID ${id}.`);
    }

    const filename = product.technicalSheetUrl.split('/').pop();
    if (filename) {
        const filePath = join(__dirname, '..', '..' ,'uploads', filename);
        try {
            await unlink(filePath);
        } catch (error) {
            console.error(`Failed to delete physical file ${filename}:`, error);
        }
    }

    return this.prisma.product.update({
      where: { id },
      data: { technicalSheetUrl: null },
    });
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