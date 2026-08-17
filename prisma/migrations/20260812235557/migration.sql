/*
  Warnings:

  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `CategoryExtras` table. If the table is not empty, all the data it contains will be lost.
  - The required column `orderItem_id` was added to the `OrderItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "CategoryExtras" DROP CONSTRAINT "CategoryExtras_category_id_fkey";

-- DropForeignKey
ALTER TABLE "CategoryExtras" DROP CONSTRAINT "CategoryExtras_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "CategorySize" DROP CONSTRAINT "CategorySize_category_id_fkey";

-- DropForeignKey
ALTER TABLE "CategorySize" DROP CONSTRAINT "CategorySize_size_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductExtra" DROP CONSTRAINT "ProductExtra_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductExtra" DROP CONSTRAINT "ProductExtra_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_size_id_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ADD COLUMN     "orderItem_id" TEXT NOT NULL,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItem_id");

-- DropTable
DROP TABLE "CategoryExtras";

-- CreateTable
CREATE TABLE "CategoryExtra" (
    "category_id" TEXT NOT NULL,
    "extra_id" TEXT NOT NULL,

    CONSTRAINT "CategoryExtra_pkey" PRIMARY KEY ("category_id","extra_id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductExtra" ADD CONSTRAINT "ProductExtra_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductExtra" ADD CONSTRAINT "ProductExtra_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtra" ADD CONSTRAINT "CategoryExtra_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtra" ADD CONSTRAINT "CategoryExtra_extra_id_fkey" FOREIGN KEY ("extra_id") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
