import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService) { }

    async getStockBySku(tenantId: string, sku: string) {
        const product = await this.prisma.product.findUnique({
            where: {
                tenantId_sku: {
                    tenantId,
                    sku,
                },
            },
            include: {
                lots: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with SKU ${sku} not found`);
        }

        // Calculate physical stock from lots
        const physicalStock = product.lots.reduce((acc, lot) => acc + lot.currentQuantity, 0);

        // TODO: Subtract committed stock from pending orders/carts once Order logic is fully integrated
        const committedStock = 0;
        const availableStock = physicalStock - committedStock;

        return {
            productId: product.id,
            sku,
            barcode: product.barcode,
            physicalStock,
            committedStock,
            availableStock,
        };
    }

    async getStockByBarcode(tenantId: string, barcode: string) {
        const product = await this.prisma.product.findFirst({
            where: {
                tenantId,
                barcode,
            },
            include: {
                lots: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with barcode ${barcode} not found`);
        }

        const physicalStock = product.lots.reduce((acc, lot) => acc + lot.currentQuantity, 0);
        const committedStock = 0;
        const availableStock = physicalStock - committedStock;

        return {
            productId: product.id,
            sku: product.sku,
            barcode,
            physicalStock,
            committedStock,
            availableStock,
        };
    }
}
