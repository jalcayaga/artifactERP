import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Testing connection...');
    const count = await prisma.user.count();
    console.log('User count:', count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
