import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tenant, TenantBranding } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Tenant & { branding: TenantBranding | null }> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: { branding: true },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async findBySlug(slug: string): Promise<(Tenant & { branding: TenantBranding | null }) | null> {
    return this.prisma.tenant.findUnique({
      where: { slug },
      include: { branding: true },
    });
  }

  async list(): Promise<Array<Tenant & { branding: TenantBranding | null }>> {
    return this.prisma.tenant.findMany({
      include: { branding: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
    return this.prisma.tenant.create({ data });
  }

  async upsertBranding(tenantId: string, data: Prisma.TenantBrandingCreateInput): Promise<void> {
    await this.prisma.tenantBranding.upsert({
      where: { tenantId },
      update: data,
      create: { tenantId, ...data },
    });
  }
}
