import { PrismaClient, Action } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Permission } from '../src/common/types/permissions.types';

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

  console.log('🌱 Seeding complete.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());