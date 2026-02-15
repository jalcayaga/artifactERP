import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateReceptionDto } from './dto/create-reception.dto'
import { UpdateReceptionDto } from './dto/update-reception.dto'
import { Reception } from '@prisma/client'

@Injectable()
export class ReceptionsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, data: CreateReceptionDto): Promise<Reception> {
        return this.prisma.$transaction(async (tx) => {
            // 1. Verify Warehouse
            const warehouse = await tx.warehouse.findUnique({
                where: { id: data.warehouseId },
            })
            if (!warehouse || warehouse.tenantId !== tenantId) {
                throw new NotFoundException('Warehouse not found')
            }

            // 2. Create Reception Record
            const reception = await tx.reception.create({
                data: {
                    tenantId,
                    warehouseId: data.warehouseId,
                    purchaseOrderId: data.purchaseOrderId,
                    receptionNumber: data.receptionNumber,
                    receptionDate: data.receptionDate ? new Date(data.receptionDate) : new Date(),
                    notes: data.notes,
                    status: 'COMPLETED', // Default to completed for now, assuming direct entry
                },
            })

            // 3. Process Items and Create Lots
            for (const item of data.items) {
                // Generate a lot number (simple logic: R-{receptionId}-{productId}-{random/seq})
                // Or use a provided one? DTO doesn't have lotNumber. Let's auto-generate.
                const lotNumber = `LOT-${reception.receptionNumber || 'REC'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`

                // Retrieve purchase price if linked to PO? 
                // Logic: if PO exists, get price from PO item? 
                // For now, allow 0 or default price since we don't have unitPrice in ReceptionItem DTO.
                // Wait, cost is important. Let's try to find the product price if not in PO.
                // If PO exists, find the item in PO.
                let purchasePrice = 0

                if (data.purchaseOrderId) {
                    const poItem = await tx.purchaseOrderItem.findFirst({
                        where: { purchaseOrderId: data.purchaseOrderId, productId: item.productId }
                    })
                    if (poItem) {
                        purchasePrice = Number(poItem.unitPrice)
                    }
                }

                if (purchasePrice === 0) {
                    // Fallback to product price? Or keep 0?
                    // Keeping 0 is safer than guessing.
                }

                // Create the Lot
                const lot = await tx.lot.create({
                    data: {
                        tenantId,
                        productId: item.productId,
                        warehouseId: data.warehouseId,
                        lotNumber,
                        initialQuantity: item.quantity,
                        currentQuantity: item.quantity,
                        purchasePrice,
                        entryDate: new Date(),
                        expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
                        location: item.location,
                    }
                })

                // Create Reception Item linked to Lot
                await tx.receptionItem.create({
                    data: {
                        receptionId: reception.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        lotId: lot.id
                    }
                })
            }

            return reception
        })
    }

    async findAll(tenantId: string): Promise<Reception[]> {
        return this.prisma.reception.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                warehouse: true,
                purchaseOrder: true,
                _count: { select: { items: true } }
            }
        })
    }

    async findOne(tenantId: string, id: string) {
        const reception = await this.prisma.reception.findUnique({
            where: { id },
            include: {
                warehouse: true,
                purchaseOrder: {
                    include: { company: true }
                },
                items: {
                    include: { product: true, lot: true }
                }
            }
        })

        if (!reception || reception.tenantId !== tenantId) {
            throw new NotFoundException(`Reception with ID ${id} not found`)
        }
        return reception
    }

    // Update is restricted for Receptions as they affect inventory/Lots.
    // Usually strict ERPs don't allow editing receptions easily.
    // We will allow updating basic fields (notes, number), but NOT items for now to avoid complex stock reconciliation.
    async update(
        tenantId: string,
        id: string,
        data: UpdateReceptionDto
    ): Promise<Reception> {
        await this.ensureBelongsToTenant(tenantId, id)

        // Block item updates
        if (data.items) {
            throw new BadRequestException('Updating reception items is not allowed. Please cancel/reverse and create a new reception.')
        }

        return this.prisma.reception.update({
            where: { id },
            data: {
                receptionNumber: data.receptionNumber,
                receptionDate: data.receptionDate ? new Date(data.receptionDate) : undefined,
                notes: data.notes
            }
        })
    }

    async remove(tenantId: string, id: string): Promise<Reception> {
        await this.ensureBelongsToTenant(tenantId, id)

        // Strict check: if lots have been used, cannot delete?
        // This is complex. For now, simple delete which might fail if FK constraints exist (Restrict on Lot?).
        // Schema says Lot.receptionItems... wait.
        // Lot doesn't have Cascade delete from Reception.
        // If we delete Reception, we probably should delete the Lots created by it IF they haven't been used.
        // This requires checking `currentQuantity == initialQuantity` for all lots.

        const reception = await this.findOne(tenantId, id)

        // Check lots usage
        for (const item of reception.items) {
            if (item.lotId) {
                const lot = await this.prisma.lot.findUnique({ where: { id: item.lotId } })
                if (lot && lot.currentQuantity !== lot.initialQuantity) {
                    throw new BadRequestException(`Cannot delete reception. Lot ${lot.lotNumber} has been used (stock moved or sold).`)
                }
            }
        }

        // If safe, delete lots and reception
        // We need transaction
        return this.prisma.$transaction(async (tx) => {
            // Delete items first (Cascade handles it usually but logic requires lot deletion)
            // Actually schema: ReceptionItem -> Reception (Cascade).
            // ReceptionItem -> Lot. Item has lotId. Lot has ONE-TO-MANY receptionItems? No, Lot has link?
            // Let's see Schema.
            // ReceptionItem has `lotId`.
            // We need to delete the Lots manually if we want to remove the stock.

            for (const item of reception.items) {
                if (item.lotId) {
                    await tx.lot.delete({ where: { id: item.lotId } })
                }
            }

            return tx.reception.delete({ where: { id } })
        })
    }

    private async ensureBelongsToTenant(tenantId: string, id: string) {
        const reception = await this.prisma.reception.findUnique({ where: { id } })
        if (!reception || reception.tenantId !== tenantId) {
            throw new NotFoundException('Reception not found')
        }
    }
}
