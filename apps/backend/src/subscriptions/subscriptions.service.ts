import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus, BillingInterval, Prisma, Subscription } from '@prisma/client';
import { addMonths, addYears } from 'date-fns';

@Injectable()
export class SubscriptionsService {
    private readonly logger = new Logger(SubscriptionsService.name);

    constructor(private prisma: PrismaService) { }

    async createSubscription(data: {
        tenantId: string;
        companyId: string;
        productId: string;
        interval: BillingInterval;
    }): Promise<Subscription> {
        const product = await this.prisma.product.findUnique({
            where: { id: data.productId },
        });

        if (!product) throw new NotFoundException('Plan (Product) not found');

        const now = new Date();
        const nextBillingDate = data.interval === 'MONTHLY'
            ? addMonths(now, 1)
            : addYears(now, 1);

        return this.prisma.subscription.create({
            data: {
                tenantId: data.tenantId,
                companyId: data.companyId,
                productId: data.productId,
                status: SubscriptionStatus.ACTIVE,
                interval: data.interval,
                price: product.price,
                currentPeriodStart: now,
                currentPeriodEnd: nextBillingDate,
                nextBillingDate: nextBillingDate,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.subscription.findMany({
            where: { tenantId },
            include: {
                company: true,
                product: true,
            },
        });
    }

    async processRenewals() {
        this.logger.log('Processing subscription renewals...');
        const now = new Date();

        const dueSubscriptions = await this.prisma.subscription.findMany({
            where: {
                status: SubscriptionStatus.ACTIVE,
                nextBillingDate: { lte: now },
            },
            include: {
                company: true,
                product: true,
                tenant: true,
            },
        });

        this.logger.log(`Found ${dueSubscriptions.length} subscriptions due for renewal.`);

        for (const sub of dueSubscriptions) {
            try {
                await this.renewSubscription(sub);
            } catch (error) {
                this.logger.error(`Failed to renew subscription ${sub.id}:`, error);
            }
        }
    }

    private async renewSubscription(sub: any) {
        this.logger.log(`Renewing subscription ${sub.id} for company ${sub.company.name}`);

        // In a real scenario, we would create a new Order and Invoice here.
        // For this ERP SaaS, we create the order in the 'Mother' tenant context.

        const nextEnd = sub.interval === BillingInterval.MONTHLY
            ? addMonths(sub.currentPeriodEnd, 1)
            : addYears(sub.currentPeriodEnd, 1);

        await this.prisma.subscription.update({
            where: { id: sub.id },
            data: {
                currentPeriodStart: sub.currentPeriodEnd,
                currentPeriodEnd: nextEnd,
                nextBillingDate: nextEnd,
            },
        });

        // TODO: Trigger Order/Invoice creation for the next period
        this.logger.log(`Subscription ${sub.id} updated. Next billing: ${nextEnd}`);
    }
}
