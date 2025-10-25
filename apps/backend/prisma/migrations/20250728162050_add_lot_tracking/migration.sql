/*
  Warnings:

  - You are about to drop the column `createdAt` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productNameSnapshot` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productSkuSnapshot` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `totalItemPrice` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `unitPriceSnapshot` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `order_items` table. All the data in the column will be lost.
  - You are about to alter the column `itemVatAmount` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `currentStock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `purchase_items` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `purchase_items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `purchase_items` table. All the data in the column will be lost.
  - You are about to alter the column `unitPrice` on the `purchase_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `totalPrice` on the `purchase_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `itemVatAmount` on the `purchase_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `totalPriceWithVat` on the `purchase_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `expectedDeliveryDate` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `observations` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `vatRatePercent` on the `purchases` table. All the data in the column will be lost.
  - You are about to alter the column `totalVatAmount` on the `purchases` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `grandTotal` on the `purchases` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `totalPrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPriceWithVat` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `purchase_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `subTotalAmount` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "createdAt",
DROP COLUMN "productNameSnapshot",
DROP COLUMN "productSkuSnapshot",
DROP COLUMN "totalItemPrice",
DROP COLUMN "unitPriceSnapshot",
DROP COLUMN "updatedAt",
ADD COLUMN     "lotId" TEXT,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalPriceWithVat" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "itemVatAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "products" DROP COLUMN "currentStock";

-- AlterTable
ALTER TABLE "purchase_items" DROP COLUMN "createdAt",
DROP COLUMN "productName",
DROP COLUMN "updatedAt",
ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "itemVatAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalPriceWithVat" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "expectedDeliveryDate",
DROP COLUMN "observations",
DROP COLUMN "orderDate",
DROP COLUMN "subTotal",
DROP COLUMN "vatRatePercent",
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subTotalAmount" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "supplierName" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "totalVatAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "grandTotal" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "lots" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "purchaseItemId" TEXT,
    "lotNumber" TEXT NOT NULL,
    "initialQuantity" INTEGER NOT NULL,
    "currentQuantity" INTEGER NOT NULL,
    "purchasePrice" DECIMAL(10,2) NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" TIMESTAMP(3),
    "location" TEXT,

    CONSTRAINT "lots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lots_lotNumber_key" ON "lots"("lotNumber");

-- CreateIndex
CREATE INDEX "lots_productId_idx" ON "lots"("productId");

-- CreateIndex
CREATE INDEX "lots_entryDate_idx" ON "lots"("entryDate");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "purchase_items_purchaseId_idx" ON "purchase_items"("purchaseId");

-- CreateIndex
CREATE INDEX "purchase_items_productId_idx" ON "purchase_items"("productId");

-- AddForeignKey
ALTER TABLE "lots" ADD CONSTRAINT "lots_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lots" ADD CONSTRAINT "lots_purchaseItemId_fkey" FOREIGN KEY ("purchaseItemId") REFERENCES "purchase_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
