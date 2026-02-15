import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const regions = await prisma.region.count();
    const communes = await prisma.commune.count();
    const units = await prisma.unit.count();
    console.log({ regions, communes, units });
}
main().catch(console.error).finally(() => prisma.$disconnect());
