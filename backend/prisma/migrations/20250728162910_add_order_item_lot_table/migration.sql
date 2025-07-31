/*
  Warnings:

  - You are about to drop the column `lotId` on the `order_items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_lotId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "lotId";

-- CreateTable
CREATE TABLE "order_item_lots" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantityTaken" INTEGER NOT NULL,

    CONSTRAINT "order_item_lots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_item_lots_orderItemId_lotId_key" ON "order_item_lots"("orderItemId", "lotId");

-- AddForeignKey
ALTER TABLE "order_item_lots" ADD CONSTRAINT "order_item_lots_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_lots" ADD CONSTRAINT "order_item_lots_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
