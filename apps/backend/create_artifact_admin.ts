
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'artifact@artifact.cl';
    const passwordRaw = 'Artifact!2025'; // Default password
    const tenantSlug = 'artifact'; // Main tenant

    console.log(`🔍 Buscando tenant '${tenantSlug}'...`);
    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
    });

    if (!tenant) {
        console.error(`❌ Tenant '${tenantSlug}' no encontrado.`);
        return;
    }

    console.log(`✅ Tenant encontrado: ${tenant.name} (${tenant.id})`);

    console.log(`🔍 Buscando rol 'ADMIN'...`);
    const adminRole = await prisma.role.findUnique({
        where: { name: 'ADMIN' },
    });

    if (!adminRole) {
        console.error(`❌ Rol 'ADMIN' no encontrado.`);
        return;
    }
    console.log(`✅ Rol encontrado: ${adminRole.name} (${adminRole.id})`);

    console.log(`🔐 Hasheando contraseña...`);
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(passwordRaw, salt);

    console.log(`👤 Creando/Actualizando usuario '${email}'...`);
    const user = await prisma.user.upsert({
        where: {
            tenantId_email: {
                tenantId: tenant.id,
                email: email,
            },
        },
        update: {
            password: password,
            roles: {
                connect: { id: adminRole.id },
            },
            // Ensure specific fields are updated if user exists
            firstName: 'Artifact',
            lastName: 'Admin',
            isActive: true,
        },
        create: {
            email: email,
            password: password,
            firstName: 'Artifact',
            lastName: 'Admin',
            tenantId: tenant.id,
            isActive: true,
            roles: {
                connect: { id: adminRole.id },
            },
        },
        include: {
            roles: true,
        },
    });

    console.log(`\n✅ Usuario configurado exitosamente:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${passwordRaw}`);
    console.log(`   Roles: ${user.roles.map((r) => r.name).join(', ')}`);
    console.log(`   Tenant: ${tenant.name}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
