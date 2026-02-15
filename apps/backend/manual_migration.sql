-- Create Enums
CREATE TYPE "IndicatorType" AS ENUM ('UF', 'USD', 'UTM');

-- Create Regions Table
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "romanNumber" TEXT,
    "number" INTEGER,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- Create Communes Table
CREATE TABLE "communes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "communes_pkey" PRIMARY KEY ("id")
);

-- Create Branches Table
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "communeId" TEXT,
    "phone" TEXT,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- Create EconomicIndicators Table
CREATE TABLE "economic_indicators" (
    "id" TEXT NOT NULL,
    "indicator" "IndicatorType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "economic_indicators_pkey" PRIMARY KEY ("id")
);

-- Create Indexes and Unique Constraints
CREATE INDEX "communes_regionId_idx" ON "communes"("regionId");
CREATE INDEX "branches_companyId_idx" ON "branches"("companyId");
CREATE INDEX "branches_communeId_idx" ON "branches"("communeId");
CREATE UNIQUE INDEX "economic_indicators_indicator_date_key" ON "economic_indicators"("indicator", "date");

-- Add Foreign Keys
ALTER TABLE "communes" ADD CONSTRAINT "communes_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "branches" ADD CONSTRAINT "branches_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "branches" ADD CONSTRAINT "branches_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update Existing Tables (Product, Warehouse)
-- Note: Run these only if the columns don't exist
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unit" TEXT DEFAULT 'UN';
ALTER TABLE "warehouses" ADD COLUMN IF NOT EXISTS "branchId" TEXT;
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
