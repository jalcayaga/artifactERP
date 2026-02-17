
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class AutomationService {
    private readonly logger = new Logger(AutomationService.name);

    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService
    ) { }

    /**
     * Searches for products and adds "intelligence" data (stock, average cost, suggested price)
     * optimized for AI context generation in n8n.
     */
    async getEnrichedProductSearch(tenantId: string, term: string) {
        // 1. Basic search using existing products service
        const products = await this.productsService.search(tenantId, term, 1, 5);

        // 2. Enrich each product with intelligence
        const enriched = await Promise.all(
            products.data.map(async (p) => {
                const intelligence = await this.productsService.getIntelligence(tenantId, p.id);
                return {
                    id: p.id,
                    sku: p.sku,
                    name: p.name,
                    description: p.description,
                    basePrice: Number(p.price),
                    stock: intelligence.lots.reduce((acc, l) => acc + l.currentQuantity, 0),
                    warehouses: intelligence.lots.map(l => ({
                        name: l.warehouseName,
                        quantity: l.currentQuantity
                    })),
                    branchPrices: intelligence.branchPrices
                };
            })
        );

        return enriched;
    }

    /**
     * Discovers a client by phone number and returns their profile and recent activity.
     */
    async getClientByPhone(tenantId: string, phone: string) {
        const cleanPhone = phone.replace(/\D/g, '');

        const company = await (this.prisma.company as any).findFirst({
            where: {
                tenantId,
                OR: [
                    { phone: { contains: cleanPhone } },
                    { phone: { contains: phone } },
                ],
            },
            include: {
                orders: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                }
            }
        });

        if (!company) return null;

        return {
            id: company.id,
            name: company.name,
            taxId: company.rut,
            email: company.email,
            phone: company.phone,
            isClient: company.isClient,
            isSupplier: company.isSupplier,
            recentOrders: (company.orders || []).map((o: any) => ({
                id: o.id,
                total: Number(o.grandTotalAmount),
                status: o.status,
                createdAt: o.createdAt
            }))
        };
    }
}
