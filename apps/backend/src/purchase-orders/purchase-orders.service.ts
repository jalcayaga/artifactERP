import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto'
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto'
import { PurchaseOrder } from '@prisma/client'

@Injectable()
export class PurchaseOrdersService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
        // Calculate totals
        let totalAmount = 0
        const itemsData = data.items.map(item => {
            const totalPrice = item.quantity * item.unitPrice
            totalAmount += totalPrice
            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: totalPrice
            }
        })

        return this.prisma.purchaseOrder.create({
            data: {
                tenantId,
                companyId: data.companyId,
                orderNumber: data.orderNumber,
                issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
                notes: data.notes,
                currency: data.currency || 'CLP',
                totalAmount,
                status: 'DRAFT',
                items: {
                    create: itemsData
                }
            },
            include: {
                items: {
                    include: { product: true }
                },
                company: true
            }
        })
    }

    async findAll(tenantId: string): Promise<PurchaseOrder[]> {
        return this.prisma.purchaseOrder.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                company: true,
                _count: {
                    select: { items: true, receptions: true }
                }
            }
        })
    }

    async findOne(tenantId: string, id: string): Promise<PurchaseOrder> {
        const order = await this.prisma.purchaseOrder.findUnique({
            where: { id },
            include: {
                company: true,
                items: {
                    include: { product: true }
                },
                receptions: true
            }
        })

        if (!order || order.tenantId !== tenantId) {
            throw new NotFoundException(`Purchase Order with ID ${id} not found`)
        }
        return order
    }

    async update(
        tenantId: string,
        id: string,
        data: UpdatePurchaseOrderDto
    ): Promise<PurchaseOrder> {
        await this.ensureBelongsToTenant(tenantId, id)

        // For simplicity, updating items is complex via mapped types. 
        // Usually updates to items require a specific logic (delete/replace/upsert).
        // Here we will update header fields only if items are not provided, 
        // or replace all items if items are provided (simple approach).

        if (data.items) {
            // Recalculate total if items change
            let totalAmount = 0
            const itemsData = data.items.map(item => {
                const totalPrice = item.quantity * item.unitPrice
                totalAmount += totalPrice
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: totalPrice
                }
            })

            return this.prisma.purchaseOrder.update({
                where: { id },
                data: {
                    companyId: data.companyId,
                    orderNumber: data.orderNumber,
                    issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
                    deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null, // explicit null
                    notes: data.notes,
                    currency: data.currency,
                    totalAmount,
                    items: {
                        deleteMany: {}, // Clear existing items
                        create: itemsData
                    }
                },
                include: { items: true }
            })
        }

        return this.prisma.purchaseOrder.update({
            where: { id },
            data: {
                ...data,
                issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
                items: undefined // Ignore items in this branch
            }
        })
    }

    async remove(tenantId: string, id: string): Promise<PurchaseOrder> {
        await this.ensureBelongsToTenant(tenantId, id)
        return this.prisma.purchaseOrder.delete({
            where: { id },
        })
    }

    private async ensureBelongsToTenant(tenantId: string, id: string) {
        const order = await this.prisma.purchaseOrder.findUnique({
            where: { id }
        })
        if (!order || order.tenantId !== tenantId) {
            throw new NotFoundException(`Purchase Order not found`)
        }
    }
}
