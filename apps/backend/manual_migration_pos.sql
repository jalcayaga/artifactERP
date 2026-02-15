-- Create Cash Registers Table
CREATE TABLE IF NOT EXISTS "cash_registers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "macAddress" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_registers_pkey" PRIMARY KEY ("id")
);

-- Create POS Shifts Table
CREATE TABLE IF NOT EXISTS "pos_shifts" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "cashRegisterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "initialCash" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "finalCash" DECIMAL(65,30),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_shifts_pkey" PRIMARY KEY ("id")
);

-- Add posShiftId to Orders
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "posShiftId" TEXT;

-- Create Indexes and Unique Constraints
CREATE UNIQUE INDEX IF NOT EXISTS "cash_registers_tenantId_code_key" ON "cash_registers"("tenantId", "code");
CREATE INDEX IF NOT EXISTS "pos_shifts_tenantId_idx" ON "pos_shifts"("tenantId");
CREATE INDEX IF NOT EXISTS "pos_shifts_cashRegisterId_idx" ON "pos_shifts"("cashRegisterId");
CREATE INDEX IF NOT EXISTS "pos_shifts_userId_idx" ON "pos_shifts"("userId");

-- Add Foreign Keys
ALTER TABLE "cash_registers" ADD CONSTRAINT "cash_registers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pos_shifts" ADD CONSTRAINT "pos_shifts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pos_shifts" ADD CONSTRAINT "pos_shifts_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES "cash_registers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pos_shifts" ADD CONSTRAINT "pos_shifts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "orders" ADD CONSTRAINT "orders_posShiftId_fkey" FOREIGN KEY ("posShiftId") REFERENCES "pos_shifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
