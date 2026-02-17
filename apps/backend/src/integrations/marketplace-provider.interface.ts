import { CreateSaleDto } from '../sales/dto/create-sale.dto';
import { OrderSource } from '@prisma/client';

export interface MarketplaceOrder {
    externalOrderId: string;
    externalStatus: string;
    customerName: string;
    customerEmail?: string;
    items: Array<{
        sku: string;
        quantity: number;
        unitPrice: number;
    }>;
    totalAmount: number;
    rawPayload: any;
}

export interface IMarketplaceProvider {
    getProviderName(): OrderSource;
    syncOrders(tenantId: string, config: any): Promise<void>;
    updateStock(tenantId: string, productId: string, newStock: number, config: any): Promise<void>;
    handleWebhook(tenantId: string, payload: any, config: any): Promise<void>;
}
