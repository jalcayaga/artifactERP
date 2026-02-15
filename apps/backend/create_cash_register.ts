
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tenantSlug = 'artifact';
    console.log(`Looking for tenant with slug: ${tenantSlug}`);

    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
    });

    if (!tenant) {
        console.error(`Tenant '${tenantSlug}' not found.`);
        process.exit(1);
    }

    console.log(`Found tenant: ${tenant.name} (${tenant.id})`);

    // Check for existing registers
    const existingRegisters = await prisma.cashRegister.findMany({
        where: { tenantId: tenant.id },
    });

    if (existingRegisters.length > 0) {
        console.log(`Cash registers already exist:`, existingRegisters);
        return;
    }

    // Create default register
    console.log('Creating default Cash Register...');
    const register = await prisma.cashRegister.create({
        data: {
            name: 'Caja Principal',
            code: 'CAJA-01',
            tenantId: tenant.id,
            isActive: true,
        },
    });

    console.log('Created Cash Register:', register);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
