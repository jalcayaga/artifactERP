import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, Tenant, TenantBranding, User } from '@prisma/client'
import { RegisterTenantDto } from './dto/register-tenant.dto'
import * as bcrypt from 'bcrypt'
import { addMonths } from 'date-fns'

import { PaymentsService } from '../payments/payments.service'
import { SubscriptionsService } from '../subscriptions/subscriptions.service'

@Injectable()
export class TenantsService {
  private cache = new Map<string, { data: any; expires: number }>()
  private readonly CACHE_TTL = 60 * 1000 // 60 seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    private readonly subscriptionsService: SubscriptionsService
  ) { }

  async findById(
    id: string
  ): Promise<Tenant & { branding: TenantBranding | null }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: { branding: true },
    })
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`)
    }
    return tenant
  }

  async findBySlug(
    slug: string
  ): Promise<(Tenant & { branding: TenantBranding | null }) | null> {
    const cacheKey = `slug:${slug}`
    const now = Date.now()
    const cached = this.cache.get(cacheKey)

    if (cached && cached.expires > now) {
      return cached.data
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: { branding: true },
    })

    if (tenant) {
      this.cache.set(cacheKey, { data: tenant, expires: now + this.CACHE_TTL })
    }

    if (!tenant) {
      // Don't throw here for middleware logic to handle fallback, or throw if consistent with previous
      // Original code threw NotFoundException, but middleware catches it.
      // Let's keep consistency.
      throw new NotFoundException(`Tenant with slug ${slug} not found`)
    }
    return tenant
  }

  async findByDomain(
    domain: string
  ): Promise<(Tenant & { branding: TenantBranding | null }) | null> {
    const cacheKey = `domain:${domain}`
    const now = Date.now()
    const cached = this.cache.get(cacheKey)

    if (cached && cached.expires > now) {
      return cached.data
    }

    const tenant = await this.prisma.tenant.findFirst({
      where: {
        OR: [
          { primaryDomain: domain },
          { domains: { has: domain } },
        ],
      },
      include: { branding: true },
    })

    if (tenant) {
      this.cache.set(cacheKey, { data: tenant, expires: now + this.CACHE_TTL })
    }

    if (!tenant) {
      throw new NotFoundException(`Tenant with domain ${domain} not found`)
    }
    return tenant
  }

  async list(): Promise<Array<Tenant & { branding: TenantBranding | null }>> {
    return this.prisma.tenant.findMany({
      include: { branding: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
    return this.prisma.tenant.create({ data })
  }

  async register(data: RegisterTenantDto): Promise<{ tenant: Tenant; user: User }> {
    // Basic registration logic reused or delegated
    return this.salesFlowRegister(data);
  }

  async salesFlowRegister(data: RegisterTenantDto): Promise<{ tenant: Tenant; user: User; order?: any }> {
    const { companyName, email, password, slug: providedSlug } = data

    // 1. Determine Slug
    let slug = providedSlug
    if (!slug) {
      slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }

    // 2. Check overlap
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug },
    })
    if (existingTenant) {
      throw new ConflictException(`Tenant/URL "${slug}" is already taken.`)
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Transaction to create everything
    const result = await this.prisma.$transaction(async (tx) => {
      // Create Tenant for the NEW SaaS Client
      // Create Tenant for the NEW SaaS Client
      const newTenant = await tx.tenant.create({
        data: {
          name: companyName,
          displayName: companyName,
          slug: slug!,
          isActive: true,
        },
      })

      // Create Admin User for this new tenant
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: companyName,
          tenant: { connect: { id: newTenant.id } },
          roles: {
            connect: [{ name: 'ADMIN' }, { name: 'SUPERADMIN' }],
          },
        },
      })

      // Create Company Entity (Self-reference)
      await tx.company.create({
        data: {
          name: companyName,
          tenant: { connect: { id: newTenant.id } },
          user: { connect: { id: user.id } },
          isClient: true,
          isSupplier: true,
        },
      })

      // --- SAAS LOGIC: Generate Sale in MOTHER Tenant ---
      const motherTenant = await tx.tenant.findUnique({ where: { slug: 'artifact' } });
      let invoice = null;

      if (motherTenant) {
        // 1. Ensure the new client exists as a "Company" (Customer) in the Mother Tenant
        let clientInMotherTenant = await tx.company.findFirst({
          where: { tenantId: motherTenant.id, email: email }
        });

        // Need a user to own the records in mother tenant
        // Usually an internal sales rep or system user
        const motherAdmin = await tx.user.findFirst({ where: { tenantId: motherTenant.id } });

        if (motherAdmin) {
          if (!clientInMotherTenant) {
            clientInMotherTenant = await tx.company.create({
              data: {
                name: companyName,
                email: email,
                tenant: { connect: { id: motherTenant.id } },
                user: { connect: { id: motherAdmin.id } },
                isClient: true,
                // Optional nested create for contact person if needed
                contactPeople: {
                  create: {
                    firstName: 'Admin',
                    lastName: companyName,
                    email,
                    phone: '',
                    tenant: { connect: { id: motherTenant.id } }
                  }
                }
              }
            });
          }

          // 2. Determine Product (SaaS Subscription)
          let product = await tx.product.findFirst({
            where: { tenantId: motherTenant.id, sku: 'SAAS-PRO-MONTHLY' }
          });

          if (!product) {
            product = await tx.product.create({
              data: {
                tenant: { connect: { id: motherTenant.id } },
                name: 'Suscripción Artifact ERP Pro',
                sku: 'SAAS-PRO-MONTHLY',
                price: new Prisma.Decimal(29990),
                productType: 'SERVICE',
                description: 'Mensualidad Plan Pro',
                isPublished: true
              }
            });
          }

          // 3. Create ORDER (Required for Invoice)
          const order = await tx.order.create({
            data: {
              tenant: { connect: { id: motherTenant.id } },
              company: { connect: { id: clientInMotherTenant.id } },
              user: { connect: { id: motherAdmin.id } },
              status: 'PENDING_PAYMENT',
              subTotalAmount: product.price,
              vatAmount: product.price.mul(0.19),
              grandTotalAmount: product.price.mul(1.19),
              orderItems: {
                create: [{
                  quantity: 1,
                  unitPrice: product.price,
                  totalPrice: product.price,
                  itemVatAmount: product.price.mul(0.19),
                  totalPriceWithVat: product.price.mul(1.19),
                  product: { connect: { id: product.id } }
                }]
              }
            }
          });

          // 4. Create Invoice (Draft) for Payment Link
          invoice = await tx.invoice.create({
            data: {
              tenant: { connect: { id: motherTenant.id } },
              company: { connect: { id: clientInMotherTenant.id } },
              order: { connect: { id: order.id } },
              invoiceNumber: `INV-${Date.now()}`,
              status: 'DRAFT',
              subTotalAmount: order.subTotalAmount,
              vatAmount: order.vatAmount,
              grandTotal: order.grandTotalAmount
            }
          });

          // 5. Create Subscription record
          const now = new Date();
          const nextBilling = addMonths(now, 1);
          await tx.subscription.create({
            data: {
              tenantId: motherTenant.id,
              companyId: clientInMotherTenant.id,
              productId: product.id,
              status: 'ACTIVE',
              interval: 'MONTHLY',
              price: product.price,
              currentPeriodStart: now,
              currentPeriodEnd: nextBilling,
              nextBillingDate: nextBilling,
            }
          });

          return { tenant: newTenant, user, order, invoice, motherTenantId: motherTenant.id }
        }
      }

      return { tenant: newTenant, user }
    }) as any;

    // Generate Payment Link if Invoice exists
    if (result.invoice && result.motherTenantId) {
      try {
        const linkData = await this.paymentsService.generatePaymentLink(
          result.motherTenantId,
          result.invoice.id,
          result.invoice.grandTotal.toNumber()
        );
        return { ...result, paymentLink: linkData.url };
      } catch (e) {
        console.warn('Could not generate payment link:', e);
      }
    }

    return result;
  }

  async upsertBranding(
    tenantId: string,
    data: any // Accept any to allow DTO types to be converted
  ): Promise<void> {
    // Convert JSON fields to Prisma JsonValue type
    const prismaData: Partial<Prisma.TenantBrandingUncheckedCreateInput> = {
      ...data,
      lightTheme: data.lightTheme
        ? (data.lightTheme as Prisma.InputJsonValue)
        : undefined,
      darkTheme: data.darkTheme
        ? (data.darkTheme as Prisma.InputJsonValue)
        : undefined,
      homeSections: data.homeSections
        ? (data.homeSections as Prisma.InputJsonValue)
        : undefined,
      socialLinks: data.socialLinks
        ? (data.socialLinks as Prisma.InputJsonValue)
        : undefined,
    }

    await this.prisma.tenantBranding.upsert({
      where: { tenantId },
      update: prismaData as Prisma.TenantBrandingUncheckedUpdateInput,
      create: {
        tenantId,
        ...prismaData,
      } as Prisma.TenantBrandingUncheckedCreateInput,
    })
  }

  async updateSettings(tenantId: string, data: any): Promise<void> {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: data as Prisma.InputJsonValue
      }
    })
  }
}
