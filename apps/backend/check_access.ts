
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAccess() {
    console.log('Checking Tenant...');
    const tenant = await prisma.tenant.findUnique({
        where: { slug: 'artifact' },
        include: { branding: true } // Check branding too
    });
    console.log('Tenant Artifact:', tenant);

    if (tenant) {
        console.log('Checking User...');
        const user = await prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId: tenant.id,
                    email: 'artifact@artifact.cl'
                }
            },
            include: {
                roles: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
        console.log('User Artifact Admin:', JSON.stringify(user, null, 2));

        // Check if password hash matches 'Artifact!2025' (we can't easily check bcrypt here without lib but we see if it exists)
        console.log('Has password?', !!user?.password);

        console.log('Checking Subscriptions...');
        const subs = await prisma.subscription.findMany({
            where: { tenantId: tenant.id },
            include: { product: true }
        });
        console.log('Subscriptions:', JSON.stringify(subs, null, 2));
    }
}

checkAccess()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
