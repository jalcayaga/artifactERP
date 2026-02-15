import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Manually creating dte_cafs table...');

    try {
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "dte_cafs" (
                "id" TEXT NOT NULL,
                "tenantId" TEXT NOT NULL,
                "companyId" TEXT NOT NULL,
                "dteType" INTEGER NOT NULL,
                "folioStart" INTEGER NOT NULL,
                "folioEnd" INTEGER NOT NULL,
                "lastFolioUsed" INTEGER NOT NULL DEFAULT 0,
                "cafXml" TEXT NOT NULL,
                "privateKey" TEXT NOT NULL,
                "publicKey" TEXT NOT NULL,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "dte_cafs_pkey" PRIMARY KEY ("id")
            );
        `);

        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "dte_cafs_tenantId_idx" ON "dte_cafs"("tenantId");
        `);

        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "dte_cafs_companyId_idx" ON "dte_cafs"("companyId");
        `);

        console.log('✅ Tablas e índices creados.');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
