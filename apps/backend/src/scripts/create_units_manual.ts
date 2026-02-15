import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Creating units table...');
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS units (
      id TEXT PRIMARY KEY,
      "tenantId" TEXT,
      name TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
    console.log('Units table created (if not existed).');

    try {
        console.log('Adding unitId column to products...');
        await prisma.$executeRawUnsafe('ALTER TABLE products ADD COLUMN IF NOT EXISTS "unitId" TEXT;');
        console.log('unitId added.');
    } catch (e) {
        console.error('Error adding unitId:', e.message);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
