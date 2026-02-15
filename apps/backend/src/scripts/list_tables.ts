import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
    console.log('Tables:', tables);
}
main().catch(console.error).finally(() => prisma.$disconnect());
