import { Injectable, Logger } from '@nestjs/common';
import { OrderSource, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { IMarketplaceProvider } from '../marketplace-provider.interface';
import { SalesService } from '../../sales/sales.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MeliProvider implements IMarketplaceProvider {
    private readonly logger = new Logger(MeliProvider.name);

    constructor(
        private salesService: SalesService,
        private prisma: PrismaService,
    ) { }

    getProviderName(): OrderSource {
        return OrderSource.MERCADO_LIBRE;
    }

    async syncOrders(tenantId: string, config: any): Promise<void> {
        this.logger.log(`Syncing Meli orders for tenant ${tenantId}`);
        // To be implemented: fetch orders from Meli API
    }

    async updateStock(tenantId: string, productId: string, newStock: number, config: any): Promise<void> {
        this.logger.log(`Updating Meli stock for product ${productId} to ${newStock}`);
        // To be implemented: push stock to Meli API
    }

    async handleWebhook(tenantId: string, payload: any, config: any): Promise<void> {
        this.logger.log(`Handling Meli webhook for tenant ${tenantId}: ${JSON.stringify(payload)}`);

        // 1. Identify if it's an order notification
        // Meli format usually: { resource: "/orders/123", topic: "orders", ... }
        if (payload.topic === 'orders' || payload.resource?.includes('orders')) {
            const externalOrderId = payload.resource.split('/').pop();
            this.logger.log(`Processing Meli Order: ${externalOrderId}`);

            // 2. Fetch full order details from Meli (MOCK for now, should use axios + config.accessToken)
            const meliOrder = await this.fetchMeliOrder(externalOrderId, config);

            // 3. Ensure "Mercado Libre" Client exists for this tenant
            const companyId = await this.ensureMeliClient(tenantId);

            // 4. Map items and resolve internal IDs
            const vatRate = 0.19; // IVA Chile
            const totalAmount = meliOrder.total_amount;
            const subTotal = Math.round(totalAmount / (1 + vatRate));
            const vatAmount = totalAmount - subTotal;

            const items = [];
            for (const item of meliOrder.order_items) {
                const itemData = item.item as any;
                const sku = itemData.seller_custom_field || itemData.seller_sku;
                const product = await this.prisma.product.findFirst({
                    where: { tenantId, sku }
                });

                if (product) {
                    items.push({
                        productId: product.id,
                        quantity: item.quantity,
                        unitPrice: item.unit_price,
                        totalPrice: Math.round(item.unit_price * item.quantity / (1 + vatRate)), // Subtotal for item
                        itemVatAmount: item.unit_price * item.quantity - Math.round(item.unit_price * item.quantity / (1 + vatRate)),
                        totalPriceWithVat: item.unit_price * item.quantity, // Total with VAT for item
                    });
                } else {
                    this.logger.warn(`Meli Product not found for SKU: ${sku}`);
                }
            }

            if (items.length === 0) {
                this.logger.warn(`No valid items found for Meli order ${externalOrderId}. Skipping creation.`);
                return;
            }

            // 5. Map to CreateSaleDto and Save
            await this.salesService.create(tenantId, {
                userId: config.defaultUserId, // System user or specified admin
                companyId: companyId,
                source: OrderSource.MERCADO_LIBRE,
                channelId: "MELI_CHILE",
                externalOrderId: externalOrderId,
                status: OrderStatus.PROCESSING,
                paymentStatus: PaymentStatus.PAID,
                paymentMethod: PaymentMethod.MERCADO_PAGO,
                subTotalAmount: subTotal,
                vatAmount: vatAmount,
                grandTotalAmount: totalAmount,
                currency: 'CLP',
                customerNotes: `Meli Nickname: ${meliOrder.buyer.nickname}`,
                items
            });
        }
    }

    private async fetchMeliOrder(id: string, config: any) {
        // This would be an Axios call to https://api.mercadolibre.com/orders/:id
        return {
            id,
            total_amount: 15000,
            buyer: { nickname: 'JUAN_PEREZ_TEST' },
            order_items: [
                {
                    item: { seller_sku: 'PROD-TEST-01', title: 'Producto de Prueba' },
                    quantity: 1,
                    unit_price: 15000
                }
            ]
        };
    }

    private async ensureMeliClient(tenantId: string): Promise<string> {
        const meliClient = await this.prisma.company.findFirst({
            where: { tenantId, name: 'MERCADO LIBRE (MARKETPLACE)', isClient: true }
        });

        if (meliClient) return meliClient.id;

        // Get the first admin user to own the client record
        const firstAdmin = await this.prisma.user.findFirst({
            where: { tenantId, role: 'ADMIN' }
        });

        const newClient = await this.prisma.company.create({
            data: {
                tenantId,
                userId: firstAdmin?.id || '',
                name: 'MERCADO LIBRE (MARKETPLACE)',
                rut: '77.777.777-7',
                giro: 'VENTA POR MENSAJERIA Y MARKETPLACES',
                isClient: true
            }
        });

        return newClient.id;
    }
}
