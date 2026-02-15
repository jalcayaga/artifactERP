
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from apps/backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('--- Environment Variables ---');
    console.log('JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 5) + '...');
    console.log('SUPABASE_JWT_SECRET:', process.env.SUPABASE_JWT_SECRET?.substring(0, 5) + '...');

    const email = 'jalcayagas@gmail.com'; // Adjust if user email is different
    console.log(`\n--- Checking User: ${email} ---`);

    // We need a tenantId to query unique constraint tenantId_email.
    // Or we can findFirst by email.
    const users = await prisma.user.findMany({
        where: { email },
        include: {
            roles: true,
            tenant: true,
        }
    });

    if (users.length === 0) {
        console.log('User not found.');
        // List all users to see if we have any
        const allUsers = await prisma.user.findMany({ take: 5 });
        console.log('First 5 users in DB:', allUsers.map(u => ({ email: u.email, id: u.id })));
    } else {
        for (const user of users) {
            console.log(`User ID: ${user.id}`);
            console.log(`Tenant ID: ${user.tenantId}`);
            console.log(`Roles:`, user.roles.map(r => r.name));
            console.log(`Tenant Name: ${user.tenant.name}`);
        }
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
