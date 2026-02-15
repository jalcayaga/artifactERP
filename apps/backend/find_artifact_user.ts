
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const artifactTenant = await prisma.tenant.findUnique({
        where: { slug: 'artifact' },
    });

    if (!artifactTenant) {
        console.log('Tenant "artifact" not found');
        return;
    }

    console.log(`Tenant found: ${artifactTenant.name} (${artifactTenant.id})`);

    const users = await prisma.user.findMany({
        where: { tenantId: artifactTenant.id },
        include: { roles: true },
    });

    console.log('Users for artifact tenant:');
    users.forEach(u => {
        console.log(`- ${u.email} (Roles: ${u.roles.map(r => r.name).join(', ')})`);
    });

    const companies = await prisma.company.findMany({
        where: {
            name: { contains: 'Artifact', mode: 'insensitive' }
        }
    });

    console.log('\nCompanies matching "Artifact":');
    companies.forEach(c => {
        console.log(`- ${c.name} (TenantID: ${c.tenantId})`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
