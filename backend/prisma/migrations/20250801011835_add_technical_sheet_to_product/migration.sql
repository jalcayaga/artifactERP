/*
  Warnings:

  - A unique constraint covering the columns `[rut]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "giro" TEXT,
ADD COLUMN     "rut" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zip" TEXT;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "dteFolio" INTEGER,
ADD COLUMN     "dtePdfUrl" TEXT,
ADD COLUMN     "dteProvider" TEXT,
ADD COLUMN     "dteStatus" TEXT,
ADD COLUMN     "dteXmlUrl" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "clientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "technicalSheetUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "clients_rut_key" ON "clients"("rut");

-- CreateIndex
CREATE INDEX "orders_clientId_idx" ON "orders"("clientId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
