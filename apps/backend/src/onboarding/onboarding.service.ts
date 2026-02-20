import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrialDto } from './dto/create-trial.dto';
import * as bcrypt from 'bcrypt';
import { addDays } from 'date-fns';
import { SubscriptionStatus, BillingInterval } from '@prisma/client';

@Injectable()
export class OnboardingService {
    constructor(private prisma: PrismaService) { }

    async createTrial(data: CreateTrialDto) {
        const { email, companyName, password, slug } = data;

        // 1. Check if slug exists
        const existing = await this.prisma.tenant.findUnique({ where: { slug } });
        if (existing) {
            throw new ConflictException(`La URL "${slug}" ya está en uso. Por favor elige otra.`);
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        return this.prisma.$transaction(async (tx) => {
            // 3. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    slug,
                    name: companyName,
                    displayName: companyName,
                    isActive: true,
                },
            });

            // 4. Create User (Admin)
            const adminRole = await tx.role.findUnique({ where: { name: 'ADMIN' } });
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: companyName,
                    tenantId: tenant.id,
                    roles: adminRole ? { connect: { id: adminRole.id } } : undefined,
                    isActive: true,
                },
            });

            // 5. Create Company (The user's own company)
            const company = await tx.company.create({
                data: {
                    tenantId: tenant.id,
                    userId: user.id,
                    name: companyName,
                    email,
                    isClient: false,
                    isSupplier: false,
                },
            });

            // 6. Find or Create Trial Product in Mother Tenant
            let trialProduct = await tx.product.findFirst({
                where: { sku: 'TRIAL-ERP' },
            });

            if (!trialProduct) {
                const artifactTenant = await tx.tenant.findUnique({ where: { slug: 'artifact' } });
                if (artifactTenant) {
                    trialProduct = await tx.product.create({
                        data: {
                            tenantId: artifactTenant.id,
                            name: 'Prueba Gratuita 7 Días',
                            sku: 'TRIAL-ERP',
                            price: 0,
                            salesModel: 'SUBSCRIPTION',
                            productType: 'SERVICE',
                            isPublished: true,
                        },
                    });
                }
            }

            // 7. Create Subscription (TRIALING)
            if (trialProduct) {
                const now = new Date();
                const trialEnd = addDays(now, 7);
                await tx.subscription.create({
                    data: {
                        tenantId: tenant.id,
                        companyId: company.id,
                        productId: trialProduct.id,
                        status: SubscriptionStatus.TRIALING,
                        interval: BillingInterval.MONTHLY,
                        price: 0,
                        currentPeriodStart: now,
                        currentPeriodEnd: trialEnd,
                        nextBillingDate: trialEnd,
                        trialEnd,
                    },
                });
            }

            // 8. Welcome Data (Optional: seed a default warehouse)
            await tx.warehouse.create({
                data: {
                    tenantId: tenant.id,
                    name: 'Bodega Principal',
                    isDefault: true,
                }
            });

            return {
                success: true,
                tenantSlug: tenant.slug,
                userEmail: user.email
            };
        });
    }
}
