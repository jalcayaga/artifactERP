import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderSource } from '@prisma/client';
import { IMarketplaceProvider } from './marketplace-provider.interface';

@Injectable()
export class IntegrationsService {
    private readonly logger = new Logger(IntegrationsService.name);
    private providers: Map<OrderSource, IMarketplaceProvider> = new Map();

    constructor(private prisma: PrismaService) { }

    registerProvider(provider: IMarketplaceProvider) {
        this.providers.set(provider.getProviderName(), provider);
        this.logger.log(`Registered provider: ${provider.getProviderName()}`);
    }

    async syncAll(tenantId: string) {
        const configs = await this.prisma.integrationConfig.findMany({
            where: { tenantId, isActive: true },
        });

        for (const config of configs) {
            const provider = this.providers.get(config.provider);
            if (provider) {
                try {
                    await provider.syncOrders(tenantId, config.config);
                } catch (error) {
                    this.logger.error(`Error syncing ${config.provider} for tenant ${tenantId}: ${error.message}`);
                }
            }
        }
    }

    async broadcastStockUpdate(tenantId: string, productId: string, newStock: number) {
        const configs = await this.prisma.integrationConfig.findMany({
            where: { tenantId, isActive: true },
        });

        for (const config of configs) {
            const provider = this.providers.get(config.provider);
            if (provider) {
                try {
                    await provider.updateStock(tenantId, productId, newStock, config.config);
                } catch (error) {
                    this.logger.error(`Error updating stock for ${config.provider}: ${error.message}`);
                }
            }
        }
    }

    async handleIncomingWebhook(tenantId: string, providerSource: OrderSource, payload: any) {
        const config = await this.prisma.integrationConfig.findUnique({
            where: { tenantId_provider: { tenantId, provider: providerSource } },
        });

        if (!config || !config.isActive) return;

        const provider = this.providers.get(providerSource);
        if (provider) {
            return provider.handleWebhook(tenantId, payload, config.config);
        }
    }
}
