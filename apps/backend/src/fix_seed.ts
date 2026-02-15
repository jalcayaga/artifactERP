
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'superadmin@artifact.cl';
    const supabaseId = 'b3977fc7-50bd-4f4b-a3d2-020b779848bc';
    const tenantSlug = 'artifact';

    console.log('--- Starting Fix Seed ---');

    // 1. Get Tenant ID
    const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
    if (!tenant) throw new Error(`Tenant ${tenantSlug} not found`);
    console.log(`Found tenant: ${tenant.id}`);

    // 2. Find and Delete existing user (if ID mismatch)
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
        console.log(`Found existing user: ${existingUser.id}`);
        if (existingUser.id !== supabaseId) {
            console.log('User ID mismatch. Cleaning up related data...');
            // Delete related Orders (Restrict constraint)
            await prisma.order.deleteMany({ where: { userId: existingUser.id } });
            console.log('Deleted related orders.');

            // Delete related Quotes (Unknown constraint, safe to delete)
            await prisma.quote.deleteMany({ where: { userId: existingUser.id } });
            console.log('Deleted related quotes.');

            console.log('Deleting old user...');
            await prisma.user.delete({ where: { id: existingUser.id } });
            console.log('Deleted old user.');
        } else {
            console.log('User ID matches. Skipping re-creation.');
        }
    }

    // 3. Create User with Supabase ID
    const user = await prisma.user.upsert({
        where: { id: supabaseId }, // Should use unique constraint, but ID is PK
        update: {},
        create: {
            id: supabaseId,
            email,
            password: 'placeholder_hashed_by_supabase_internally_unused_here',
            firstName: 'Super',
            lastName: 'Admin',
            tenantId: tenant.id,
            isActive: true,
            // roles?
        }
    });
    console.log(`User ensured: ${user.id}`);

    // 4. Create Company
    const company = await prisma.company.create({
        data: {
            userId: user.id,
            tenantId: tenant.id,
            name: 'Artifact Demo',
            fantasyName: 'Artifact',
            rut: '76.123.456-7',
            email: 'demo@artifact.cl',
            address: 'Av. Providencia 1234',
            city: 'Santiago',
            phone: '+56 9 1234 5678',
            isClient: false,
            isSupplier: false
        }
    });
    console.log(`Company created: ${company.name} (${company.id})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
