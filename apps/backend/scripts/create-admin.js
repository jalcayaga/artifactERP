const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async () => {
  const prisma = new PrismaClient();
  try {
    const tenant = await prisma.tenant.findUnique({ where: { slug: 'artifact' } });
    if (!tenant) throw new Error('Tenant artifact no encontrado');

    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    if (!adminRole) throw new Error('Rol ADMIN no encontrado');

    const passwordHash = await bcrypt.hash('Artifact!2025', 12);

    const user = await prisma.user.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: 'artifact@artifact.cl',
        },
      },
      update: {
        firstName: 'Equipo',
        lastName: 'Artifact',
        isActive: true,
        roles: {
          set: [{ id: adminRole.id }],
        },
      },
      create: {
        tenantId: tenant.id,
        email: 'artifact@artifact.cl',
        password: passwordHash,
        firstName: 'Equipo',
        lastName: 'Artifact',
        isActive: true,
        roles: {
          connect: [{ id: adminRole.id }],
        },
      },
      select: { email: true },
    });

    console.log('Usuario listo:', user.email);
  } catch (error) {
    console.error('Error creando usuario:', error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
