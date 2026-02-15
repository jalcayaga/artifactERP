
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Products ---');
    const products = await prisma.product.findMany({
        take: 5,
        select: { id: true, name: true, sku: true, isPublished: true, tenantId: true }
    });
    console.log(`Found ${products.length} products`);
    console.log(products);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
