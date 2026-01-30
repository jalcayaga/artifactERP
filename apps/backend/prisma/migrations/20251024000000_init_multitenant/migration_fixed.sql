-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPERADMIN';

-- DropIndex
DROP INDEX IF EXISTS "companies_email_key";
DROP INDEX IF EXISTS "companies_rut_key";
DROP INDEX IF EXISTS "contact_people_email_key";
DROP INDEX IF EXISTS "invoices_invoiceNumber_key";
DROP INDEX IF EXISTS "invoices_orderId_idx";
DROP INDEX IF EXISTS "lots_lotNumber_key";
DROP INDEX IF EXISTS "products_sku_key";
DROP INDEX IF EXISTS "users_email_key";

-- CreateTable (crear tenants PRIMERO)
CREATE TABLE IF NOT EXISTS "tenants" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "primaryDomain" TEXT,
    "domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- Crear tenant por defecto
INSERT INTO "tenants" ("id", "slug", "name", "displayName", "isActive", "createdAt", "updatedAt")
VALUES ('default-tenant', 'artifact', 'Artifact', 'Artifact Default Tenant', true, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- AlterTable - Agregar tenantId como nullable primero
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "contact_people" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "lots" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "purchases" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;

-- Actualizar todos los registros existentes con el tenant por defecto
UPDATE "companies" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "contact_people" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "invoices" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "lots" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "orders" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "payments" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "products" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "purchases" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "quotes" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;
UPDATE "users" SET "tenantId" = 'default-tenant' WHERE "tenantId" IS NULL;

-- Ahora hacer las columnas NOT NULL
ALTER TABLE "companies" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "contact_people" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "invoices" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "lots" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "payments" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "purchases" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "quotes" ALTER COLUMN "tenantId" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "tenantId" SET NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "tenant_branding" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "logoUrl" TEXT,
    "secondaryLogoUrl" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "lightTheme" JSONB,
    "darkTheme" JSONB,
    "homeSections" JSONB,
    "socialLinks" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_branding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_slug_key" ON "tenants"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "tenant_branding_tenantId_key" ON "tenant_branding"("tenantId");
CREATE INDEX IF NOT EXISTS "companies_tenantId_idx" ON "companies"("tenantId");
CREATE UNIQUE INDEX IF NOT EXISTS "companies_tenantId_rut_key" ON "companies"("tenantId", "rut") WHERE "rut" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "companies_tenantId_email_key" ON "companies"("tenantId", "email") WHERE "email" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "contact_people_tenantId_idx" ON "contact_people"("tenantId");
CREATE UNIQUE INDEX IF NOT EXISTS "contact_people_tenantId_email_key" ON "contact_people"("tenantId", "email") WHERE "email" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "invoices_tenantId_idx" ON "invoices"("tenantId");
CREATE UNIQUE INDEX IF NOT EXISTS "invoices_tenantId_invoiceNumber_key" ON "invoices"("tenantId", "invoiceNumber");
CREATE INDEX IF NOT EXISTS "lots_tenantId_idx" ON "lots"("tenantId");
CREATE UNIQUE INDEX IF NOT EXISTS "lots_tenantId_lotNumber_key" ON "lots"("tenantId", "lotNumber");
CREATE INDEX IF NOT EXISTS "orders_tenantId_idx" ON "orders"("tenantId");
CREATE INDEX IF NOT EXISTS "payments_tenantId_idx" ON "payments"("tenantId");
CREATE INDEX IF NOT EXISTS "products_tenantId_idx" ON "products"("tenantId");
CREATE UNIQUE INDEX IF NOT EXISTS "products_tenantId_sku_key" ON "products"("tenantId", "sku") WHERE "sku" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "purchases_tenantId_idx" ON "purchases"("tenantId");
CREATE INDEX IF NOT EXISTS "quotes_tenantId_idx" ON "quotes"("tenantId");
CREATE INDEX IF NOT EXISTS "users_tenantId_idx" ON "users"("tenantId");
CREATE UNIQUE INDEX IF NOT EXISTS "users_tenantId_email_key" ON "users"("tenantId", "email");

-- AddForeignKey
ALTER TABLE "tenant_branding" ADD CONSTRAINT "tenant_branding_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "companies" ADD CONSTRAINT "companies_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "contact_people" ADD CONSTRAINT "contact_people_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lots" ADD CONSTRAINT "lots_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;


