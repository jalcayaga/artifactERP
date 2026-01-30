#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

docker compose down

docker volume rm artifacterp_artifact_erp_postgres_data || true

POSTGRES_USER=artifact_user POSTGRES_PASSWORD=artifact_password POSTGRES_DB=artifact_erp_db docker compose up -d

sleep 5

docker compose exec backend npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma

docker compose exec backend npx prisma db seed --schema apps/backend/prisma/schema.prisma

docker compose exec backend node - <<'NODE'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async () => {
  const prisma = new PrismaClient();
  try {
    const tenant = await prisma.tenant.findUnique({ where: { slug: 'artifact' } });
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    const passwordHash = await bcrypt.hash('Artifact!2025', 12);

    await prisma.user.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: 'artifact@artifact.cl',
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        email: 'artifact@artifact.cl',
        password: passwordHash,
        firstName: 'Equipo',
        lastName: 'Artifact',
        isActive: true,
        roles: {
          connect: [{ id: adminRole.id }],
        },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
})();
NODE
