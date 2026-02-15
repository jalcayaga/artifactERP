import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Product, Prisma, Lot } from '@prisma/client'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(tenantId: string, data: CreateProductDto): Promise<Product> {
    if (data.sku) {
      const existingBySku = await this.prisma.product.findUnique({
        where: { tenantId_sku: { tenantId, sku: data.sku } },
      })
      if (existingBySku) {
        throw new ConflictException('Product with this SKU already exists.')
      }
    }
    return this.prisma.product.create({
      data: {
        tenantId,
        name: data.name,
        productType: data.productType,
        sku: data.sku,
        barcode: data.barcode,
        brand: data.brand,
        description: data.description,
        longDescription: data.longDescription,
        images: data.images ?? [],
        category: data.category,
        price: new Prisma.Decimal(data.price),
        unitPrice:
          data.unitPrice !== undefined
            ? new Prisma.Decimal(data.unitPrice)
            : undefined,
        reorderLevel: data.reorderLevel,
        isPublished: data.isPublished ?? true,
      },
    })
  }

  async findAll(tenantId: string): Promise<Product[]> {
    return this.prisma.product.findMany({ where: { tenantId } })
  }

  async findAllPaginated(tenantId: string, page: number, limit: number) {
    const total = await this.prisma.product.count({ where: { tenantId } })
    const data = await this.prisma.product.findMany({
      where: { tenantId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    })
    return { data, total, pages: Math.ceil(total / limit), currentPage: page }
  }

  async findPublished(
    tenantId: string,
    page: number,
    limit: number,
    filters: {
      category?: string
      searchQuery?: string
      minPrice?: number
      maxPrice?: number
    } = {}
  ) {
    const { category, searchQuery, minPrice, maxPrice } = filters
    const where: Prisma.ProductWhereInput = {
      tenantId,
      isPublished: true,
    }
    if (category) {
      where.category = { equals: category, mode: 'insensitive' }
    }
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { sku: { contains: searchQuery, mode: 'insensitive' } },
      ]
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Prisma.DecimalFilter = {}
      if (minPrice !== undefined) {
        priceFilter.gte = new Prisma.Decimal(minPrice)
      }
      if (maxPrice !== undefined) {
        priceFilter.lte = new Prisma.Decimal(maxPrice)
      }
      where.price = priceFilter
    }

    const total = await this.prisma.product.count({ where })
    const data = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const assetBaseUrl =
      process.env.PUBLIC_ASSET_BASE_URL || 'https://api.artifact.cl'
    const dataWithResolvedImages = assetBaseUrl
      ? data.map((product) => ({
        ...product,
        images: product.images.map((image) =>
          image.startsWith('http') ? image : `${assetBaseUrl}${image}`
        ),
      }))
      : data

    return {
      data: dataWithResolvedImages,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    }
  }

  async findOne(tenantId: string, id: string): Promise<Product | null> {
    return this.prisma.product.findFirst({ where: { id, tenantId } })
  }

  async search(tenantId: string, term: string, page: number, limit: number) {
    if (!term || term.trim().length === 0) {
      return { data: [], total: 0, pages: 0, currentPage: page }
    }

    const where: Prisma.ProductWhereInput = {
      tenantId,
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { sku: { contains: term, mode: 'insensitive' } },
      ],
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ])

    return { data, total, pages: Math.ceil(total / limit), currentPage: page }
  }

  async getAverageCost(
    tenantId: string,
    id: string
  ): Promise<{ averageCost: number }> {
    const lots = await this.prisma.lot.findMany({
      where: { tenantId, productId: id, currentQuantity: { gt: 0 } },
    })

    if (lots.length === 0) {
      return { averageCost: 0 }
    }

    let totalCost = 0
    let totalQuantity = 0

    lots.forEach((lot) => {
      totalCost += Number(lot.purchasePrice) * lot.currentQuantity
      totalQuantity += lot.currentQuantity
    })

    const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0

    return { averageCost }
  }

  async update(
    tenantId: string,
    id: string,
    data: UpdateProductDto
  ): Promise<Product> {
    await this.ensureBelongsToTenant(tenantId, id)
    const updateData: Prisma.ProductUpdateInput = {
      ...data,
    }

    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price)
    }
    if (data.unitPrice !== undefined) {
      updateData.unitPrice = new Prisma.Decimal(data.unitPrice)
    }

    if (data.sku) {
      const existingBySku = await this.prisma.product.findUnique({
        where: { tenantId_sku: { tenantId, sku: data.sku } },
      })
      if (existingBySku && existingBySku.id !== id) {
        throw new ConflictException('Product with this SKU already exists.')
      }
    }

    if (data.barcode) {
      const existingByBarcode = await this.prisma.product.findUnique({
        where: { barcode: data.barcode }
      })
      if (existingByBarcode && existingByBarcode.id !== id) {
        throw new ConflictException('Product with this Barcode already exists.')
      }
    }

    return this.prisma.product.update({ where: { id }, data: updateData })
  }

  async updateTechnicalSheet(
    tenantId: string,
    id: string,
    filename: string
  ): Promise<Product> {
    const product = await this.ensureBelongsToTenant(tenantId, id)
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`)
    }
    return this.prisma.product.update({
      where: { id },
      data: { technicalSheetUrl: `/uploads/${filename}` },
    })
  }

  async deleteTechnicalSheet(tenantId: string, id: string): Promise<Product> {
    const product = await this.ensureBelongsToTenant(tenantId, id)
    if (!product || !product.technicalSheetUrl) {
      throw new NotFoundException(
        `Product or technical sheet not found for ID ${id}.`
      )
    }

    const filename = product.technicalSheetUrl.split('/').pop()
    if (filename) {
      const filePath = join(__dirname, '..', '..', 'uploads', filename)
      try {
        await unlink(filePath)
      } catch (error) {
        console.error(`Failed to delete physical file ${filename}:`, error)
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: { technicalSheetUrl: null },
    })
  }

  async remove(tenantId: string, id: string): Promise<Product> {
    await this.ensureBelongsToTenant(tenantId, id)
    return this.prisma.product.delete({ where: { id } })
  }

  async getLotsByProductId(
    tenantId: string,
    productId: string
  ): Promise<Lot[]> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
      include: { lots: true },
    })

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`)
    }

    return product.lots
  }

  private async ensureBelongsToTenant(
    tenantId: string,
    productId: string
  ): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    })
    if (!product) {
      throw new ForbiddenException(
        `Product ${productId} does not belong to the current tenant.`
      )
    }
    return product
  }

  async reserveStock(
    tenantId: string,
    productId: string,
    quantity: number,
    tx?: Prisma.TransactionClient
  ): Promise<{ lotId: string; quantity: number }[]> {
    const prisma = tx || this.prisma

    // Ensure product belongs to tenant (using prisma or tx)
    const product = await prisma.product.findFirst({
      where: { id: productId, tenantId }
    })

    if (!product) {
      throw new ForbiddenException(`Product ${productId} does not belong to the current tenant.`)
    }

    // FIFO: Get lots with available stock (currentQuantity - committedQuantity), ordered by entryDate (oldest first)
    const lots = await prisma.lot.findMany({
      where: {
        tenantId,
        productId,
      },
      orderBy: { entryDate: 'asc' },
    })

    // Filter and map to include calculated available stock
    const lotsWithAvailable = lots.map(lot => ({
      ...lot,
      available: Number(lot.currentQuantity) - Number(lot.committedQuantity)
    })).filter(lot => lot.available > 0)

    const totalAvailable = lotsWithAvailable.reduce((sum, lot) => sum + lot.available, 0)

    if (totalAvailable < quantity) {
      const { OutOfStockException } = await import(
        '../common/exceptions/out-of-stock.exception'
      )
      throw new OutOfStockException(product.id, product.name, quantity, totalAvailable)
    }

    let remaining = quantity
    const allocations: { lotId: string; quantity: number }[] = []

    for (const lot of lotsWithAvailable) {
      if (remaining <= 0) break

      const taken = Math.min(lot.available, remaining)
      allocations.push({ lotId: lot.id, quantity: taken })
      remaining -= taken
    }

    // Apply updates (increment committedQuantity instead of decrementing physical stock)
    for (const alloc of allocations) {
      await prisma.lot.update({
        where: { id: alloc.lotId },
        data: { committedQuantity: { increment: alloc.quantity } },
      })
    }

    return allocations
  }

  async getAvailableStock(tenantId: string, productId: string): Promise<number> {
    const lots = await this.prisma.lot.findMany({
      where: { tenantId, productId },
    })

    return lots.reduce((sum, lot) => {
      return sum + (Number(lot.currentQuantity) - Number(lot.committedQuantity))
    }, 0)
  }

  async fulfillReservation(
    tenantId: string,
    allocations: { lotId: string; quantity: number }[],
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const prisma = tx || this.prisma

    for (const alloc of allocations) {
      await prisma.lot.update({
        where: { id: alloc.lotId },
        data: {
          currentQuantity: { decrement: alloc.quantity },
          committedQuantity: { decrement: alloc.quantity },
        },
      })
    }
  }

  async releaseReservation(
    tenantId: string,
    allocations: { lotId: string; quantity: number }[],
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const prisma = tx || this.prisma

    for (const alloc of allocations) {
      await prisma.lot.update({
        where: { id: alloc.lotId },
        data: {
          committedQuantity: { decrement: alloc.quantity },
        },
      })
    }
  }
}
