
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'artifact@artifact.cl';
    const passwordRaw = 'Artifact!2025';

    const user = await prisma.user.findFirst({
        where: { email },
        include: { tenant: true }
    });

    if (!user) {
        console.log('❌ Usuario No Encontrado en DB');
        return;
    }

    console.log(`✅ Usuario encontrado: ${user.email} (Tenant: ${user.tenant.slug})`);

    // Verify password manually
    const isMatch = await bcrypt.compare(passwordRaw, user.password);
    console.log(`🔐 Verificación de contraseña manual: ${isMatch ? 'EXITOSA' : 'FALLIDA'}`);

    if (!isMatch) {
        console.log('⚠️ La contraseña en BD no coincide. Reseteando...');
        const salt = await bcrypt.genSalt(12); // Match seed.ts rounds just in case
        const hash = await bcrypt.hash(passwordRaw, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hash }
        });
        console.log('✅ Contraseña actualizada correctamente.');

        // Verify again
        const isMatchNow = await bcrypt.compare(passwordRaw, hash);
        console.log(`🔐 Verificación post-update: ${isMatchNow ? 'EXITOSA' : 'FALLIDA'}`);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
