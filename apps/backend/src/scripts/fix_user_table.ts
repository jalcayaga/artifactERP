import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Fixing users table schema...');

    try {
        // Create UserRole enum type if doesn't exist
        await prisma.$executeRawUnsafe(`
            DO $$ BEGIN
                CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CLIENT', 'CASHIER', 'WAREHOUSE_MANAGER', 'WEB_SALES');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // Add role column if doesn't exist
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'CLIENT';
        `);

        console.log('✅ Users table fixed.');

    } catch (error) {
        console.error('❌ Error fixing table:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
