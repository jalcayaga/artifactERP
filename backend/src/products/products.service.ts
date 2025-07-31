
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, ProductType } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.sku) {
      const existingBySku = await this.prisma.client.product.findUnique({
        where: { sku: createProductDto.sku },
      });
      if (existingBySku) {
        throw new ConflictException(`Product with SKU ${createProductDto.sku} already exists.`);
      }
    }
    return this.prisma.client.product.create({
      data: {
        ...createProductDto,
        price: createProductDto.price, 
        unitPrice: createProductDto.unitPrice, 
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.client.product.findMany();
  }

  async findAllPublished(page: number = 1, limit: number = 10, category?: string): Promise<{ data: Product[], total: number, pages: number }> {
    const whereClause: any = { isPublished: true };
    if (category) {
      whereClause.category = category;
    }
    const skip = (page - 1) * limit;
    const total = await this.prisma.client.product.count({ where: whereClause });
    const data = await this.prisma.client.product.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return { data, total, pages: Math.ceil(total / limit) };
  }
  
  async findOne(id: string): Promise<Product | null> {
    const product = await this.prisma.client.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findOnePublished(id: string): Promise<Product | null> {
    const product = await this.prisma.client.product.findFirst({
      where: { id, isPublished: true },
    });
    if (!product) {
      throw new NotFoundException(`Published product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(id); 
    if (updateProductDto.sku) { 
        const existingBySku = await this.prisma.client.product.findFirst({
            where: { sku: updateProductDto.sku, NOT: { id } }, 
        });
        if (existingBySku) {
            throw new ConflictException(`Another product with SKU ${updateProductDto.sku} already exists.`); 
        }
    }
    return this.prisma.client.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(updateProductDto.price !== undefined && { price: updateProductDto.price }),
        ...(updateProductDto.unitPrice !== undefined && { unitPrice: updateProductDto.unitPrice }),
      },
    });
  }

  async remove(id: string): Promise<Product> {
    await this.findOne(id); 
    return this.prisma.client.product.delete({ where: { id } });
  }

  async checkStock(productId: string, quantityNeeded: number): Promise<boolean> {
    const product = await this.prisma.client.product.findUnique({
      where: { id: productId },
      select: { currentStock: true, productType: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found for stock check.`);
    }
    if (product.productType === ProductType.SERVICE) { 
      return true; 
    }
    return product.currentStock !== null && product.currentStock >= quantityNeeded;
  }

  async decreaseStock(productId: string, quantityToDecrease: number): Promise<Product> {
    const product = await this.prisma.client.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found for stock decrease.`);
    }
    
    if (product.productType === ProductType.SERVICE || (product.productType === ProductType.PRODUCT && product.currentStock === null)) {
        return product;
    }
    
    if (product.productType === ProductType.PRODUCT && product.currentStock !== null) {
        if (product.currentStock < quantityToDecrease) {
          throw new ConflictException(
            `Not enough stock for product ${product.name} (ID: ${productId}). Available: ${product.currentStock}, Requested: ${quantityToDecrease}`,
          );
        }

        return this.prisma.client.product.update({
          where: { id: productId },
          data: {
            currentStock: {
              decrement: quantityToDecrease,
            },
          },
        });
    }
    return product;
  }
}
