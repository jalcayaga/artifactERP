
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Deleting admin@artifact.cl ---');
    const user = await prisma.user.findFirst({
        where: { email: 'admin@artifact.cl' }
    });

    if (user) {
        await prisma.user.delete({
            where: { id: user.id }
        });
        console.log('User admin@artifact.cl deleted successfully.');
    } else {
        console.log('User admin@artifact.cl not found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
