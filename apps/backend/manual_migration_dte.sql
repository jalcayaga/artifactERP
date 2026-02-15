-- Add DTE fields to Invoices table
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "dteType" INTEGER;
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "dteTrackId" TEXT;
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "dteSignature" TEXT;
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "xmlContent" TEXT;
