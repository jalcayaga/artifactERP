import { PrismaClient, Action } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Permission } from '../src/common/types/permissions.types';
import { seedChileData } from './seeds/chile_data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding tenants...');

  const tenantsToSeed = [
    {
      slug: 'artifact',
      name: 'Artifact Platform',
      displayName: 'Artifact',
      logoUrl: process.env.DEFAULT_TENANT_LOGO || null,
      primaryDomain: 'artifact.cl',
      domains: ['artifact.cl'],
    },
    {
      slug: 'subred',
      name: 'SubRed',
      displayName: 'SubRed',
      logoUrl: null,
    },
    {
      slug: 'emporiokmarketchile',
      name: 'Emporio K Market Chile',
      displayName: 'Emporio K',
      logoUrl: null,
    },
  ];

  for (const tenantData of tenantsToSeed) {
    await prisma.tenant.upsert({
      where: { slug: tenantData.slug },
      update: {
        primaryDomain: tenantData.primaryDomain,
        domains: tenantData.domains,
      },
      create: {
        slug: tenantData.slug,
        name: tenantData.name,
        displayName: tenantData.displayName,
        primaryDomain: tenantData.primaryDomain,
        domains: tenantData.domains,
        settings: {},
        branding: {
          create: {
            logoUrl: tenantData.logoUrl,
            primaryColor: '#2563EA',
            secondaryColor: '#111827',
          },
        },
      },
    });
  }

  // Create Roles
  console.log('Creating roles...');
  const roles = [
    { name: 'SUPERADMIN', description: 'Full access' },
    { name: 'ADMIN', description: 'Manage features' },
    { name: 'EDITOR', description: 'Edit content' },
    { name: 'VIEWER', description: 'View only' },
    { name: 'CLIENT', description: 'Client access' },
    { name: 'SELLER', description: 'Sales management' },
    { name: 'ACCOUNTANT', description: 'Financial management' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
  }

  // Create Permissions
  console.log('Creating permissions...');
  const allPermissions = Object.values(Permission);
  const createdPermissions = {};
  for (const perm of allPermissions) {
    const [action, subject] = perm.split(':');
    createdPermissions[perm] = await prisma.permission.upsert({
      where: { name: perm },
      update: {},
      create: {
        name: perm,
        action: action as Action,
        subject: subject,
        description: `Permite ${action} ${subject}`,
      },
    });
  }

  // Assign Permissions
  console.log('Assigning permissions...');

  const rolePermissions = {
    SUPERADMIN: allPermissions,
    ADMIN: [
      Permission.ReadUsers, Permission.CreateProduct, Permission.ReadProducts, Permission.UpdateProduct, Permission.DeleteProduct,
      Permission.CreateOrder, Permission.ReadOrders, Permission.UpdateOrder, Permission.DeleteOrder,
      Permission.CreateInvoice, Permission.ReadInvoices, Permission.UpdateInvoice, Permission.DeleteInvoice,
    ],
    EDITOR: [
      Permission.CreateProduct, Permission.ReadProducts, Permission.UpdateProduct,
      Permission.CreateOrder, Permission.ReadOrders, Permission.UpdateOrder,
      Permission.CreateInvoice, Permission.ReadInvoices, Permission.UpdateInvoice,
    ],
    VIEWER: [Permission.ReadProducts, Permission.ReadOrders, Permission.ReadInvoices, Permission.ReadUsers],
    CLIENT: [Permission.ReadProducts, Permission.ReadOrders, Permission.ReadInvoices],
    SELLER: [Permission.ReadProducts, Permission.CreateOrder, Permission.ReadOrders, Permission.UpdateOrder],
    ACCOUNTANT: [Permission.ReadInvoices, Permission.ReadOrders, Permission.CreateInvoice, Permission.UpdateInvoice],
  };

  for (const [roleName, perms] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (role) {
      await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
      await prisma.rolePermission.createMany({
        data: perms.map(p => ({
          roleId: role.id,
          permissionId: createdPermissions[p].id,
        })),
      });
    }
  }

  // Super Admin User
  const artifactTenant = await prisma.tenant.findUnique({ where: { slug: 'artifact' } });
  if (artifactTenant) {
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(process.env.DEFAULT_SUPERADMIN_PASSWORD || 'Artifact!2025', salt);
    const saRole = await prisma.role.findUnique({ where: { name: 'SUPERADMIN' } });

    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: artifactTenant.id, email: 'superadmin@artifact.cl' } },
      update: { roles: { connect: { id: saRole.id } } },
      create: {
        tenantId: artifactTenant.id,
        email: 'superadmin@artifact.cl',
        password,
        firstName: 'Artifact',
        lastName: 'Admin',
        roles: { connect: { id: saRole.id } },
        isActive: true,
      },
    });
  }

  // Seed Subscription Products for Artifact
  if (artifactTenant) {
    console.log('Seeding subscription products...');
    const products = [
      {
        name: 'Artifact Social AI',
        sku: 'PLAN_SOCIAL_AI',
        description: 'Gestión de Redes Sociales con Inteligencia Artificial',
        price: 250000,
        salesModel: 'SUBSCRIPTION',
        isPublished: true,
        productType: 'SERVICE'
      },
      {
        name: 'Visual Soul',
        sku: 'PLAN_VISUAL_SOUL',
        description: 'Diseño de Identidad de Marca y Papelería Digital',
        price: 180000,
        salesModel: 'SUBSCRIPTION',
        isPublished: true,
        productType: 'SERVICE'
      }
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: {
          tenantId_sku: {
            tenantId: artifactTenant.id,
            sku: p.sku
          }
        },
        update: {
          name: p.name,
          price: p.price,
          salesModel: p.salesModel as any,
          productType: p.productType as any,
          isPublished: p.isPublished
        },
        create: {
          tenantId: artifactTenant.id,
          name: p.name,
          sku: p.sku,
          description: p.description,
          price: p.price,
          salesModel: p.salesModel as any,
          productType: p.productType as any,
          isPublished: p.isPublished
        }
      });
    }

    // Artifact Admin User (The CEO of Artifact SpA)
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash('Artifact!2025', salt);

    const artifactAdmin = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: artifactTenant.id, email: 'artifact@artifact.cl' } },
      update: { roles: { connect: { id: adminRole.id } } },
      create: {
        tenantId: artifactTenant.id,
        email: 'artifact@artifact.cl',
        password,
        firstName: 'Artifact',
        lastName: 'CEO',
        roles: { connect: { id: adminRole.id } },
        isActive: true
      }
    });

    // Grant Infinite Subscription to Artifact Admin
    const infinitePlan = await prisma.product.findUnique({
      where: { tenantId_sku: { tenantId: artifactTenant.id, sku: 'PLAN_VISUAL_SOUL' } }
    });

    if (infinitePlan && artifactAdmin) {
      // Ensure a Company exists for the Tenant linked to the Admin
      let mainCompany = await prisma.company.findFirst({
        where: { tenantId: artifactTenant.id, userId: artifactAdmin.id }
      });

      if (!mainCompany) {
        console.log('Creating main company for Artifact SpA...');
        mainCompany = await prisma.company.create({
          data: {
            tenantId: artifactTenant.id,
            userId: artifactAdmin.id,
            name: 'Artifact SpA',
            rut: '76.123.456-7',
            email: 'artifact@artifact.cl',
            isClient: false,
            isSupplier: false
          }
        });
      }

      if (mainCompany) {
        const existingSub = await prisma.subscription.findFirst({
          where: { tenantId: artifactTenant.id, status: 'ACTIVE' }
        });

        if (!existingSub) {
          console.log('🎁 Granting Infinite Subscription to Artifact SpA...');
          await prisma.subscription.create({
            data: {
              tenantId: artifactTenant.id,
              companyId: mainCompany.id,
              productId: infinitePlan.id,
              status: 'ACTIVE',
              interval: 'YEARLY',
              price: 0,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date('2099-12-31'), // Infinite
              nextBillingDate: new Date('2099-12-31'),
              cancelAtPeriodEnd: false
            }
          });
        } else {
          console.log('✅ Artifact SpA already has an active subscription.');
        }
      }
    }
  }

  await seedChileData(prisma);

  console.log('🌱 Seeding complete.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());