import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
    constructor(private prisma: PrismaService) { }

    async createPriceList(tenantId: string, name: string, type: 'RETAIL' | 'WEB' | 'WHOLESALE' | 'OFFER' = 'RETAIL', currency = 'CLP') {
        return this.prisma.priceList.create({
            data: {
                tenantId,
                name,
                type,
                currency,
            },
        });
    }

    async getPriceLists(tenantId: string) {
        return this.prisma.priceList.findMany({
            where: { tenantId },
        });
    }

    async setProductPrice(priceListId: string, productId: string, price: number) {
        return this.prisma.productPrice.upsert({
            where: {
                priceListId_productId: {
                    priceListId,
                    productId,
                },
            },
            update: {
                price,
            },
            create: {
                priceListId,
                productId,
                price,
            },
        });
    }

    async getPrice(tenantId: string, productId: string, type: 'RETAIL' | 'WEB' | 'WHOLESALE' | 'OFFER' = 'WEB') {
        const priceList = await this.prisma.priceList.findFirst({
            where: {
                tenantId,
                type,
                isActive: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        let price = null;

        if (priceList) {
            const productPrice = await this.prisma.productPrice.findUnique({
                where: {
                    priceListId_productId: {
                        priceListId: priceList.id,
                        productId,
                    },
                },
            });
            if (productPrice) {
                price = productPrice.price;
            }
        }

        if (price === null) {
            // Fallback to base price in Product model
            const product = await this.prisma.product.findUnique({
                where: { id: productId },
                select: { price: true },
            });
            price = product?.price || 0;
        }

        return { productId, price, source: priceList ? `${priceList.name} (${priceList.type})` : 'Base' };
    }
}
