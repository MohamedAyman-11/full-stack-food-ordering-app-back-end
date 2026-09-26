/*
  Warnings:

  - You are about to drop the column `building_number` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `CategoryExtra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `CategoryExtra` table. All the data in the column will be lost.
  - You are about to drop the column `extra_id` on the `CategoryExtra` table. All the data in the column will be lost.
  - The primary key for the `CategorySize` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `CategorySize` table. All the data in the column will be lost.
  - You are about to drop the column `size_id` on the `CategorySize` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Extra` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Extra` table. All the data in the column will be lost.
  - You are about to drop the column `building_number` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_boy_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_fee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `orderItem_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `ProductExtra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `ProductExtra` table. All the data in the column will be lost.
  - You are about to drop the column `extra_id` on the `ProductExtra` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `ProductExtra` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ProductExtra` table. All the data in the column will be lost.
  - The primary key for the `ProductSize` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `ProductSize` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `ProductSize` table. All the data in the column will be lost.
  - You are about to drop the column `size_id` on the `ProductSize` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ProductSize` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `primary_phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secondary_phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `CategoryExtra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraId` to the `CategoryExtra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `CategorySize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `CategorySize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Extra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - The required column `orderItemId` was added to the `OrderItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraId` to the `ProductExtra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductExtra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductExtra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `ProductSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryPhone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CategoryExtra" DROP CONSTRAINT "CategoryExtra_category_id_fkey";

-- DropForeignKey
ALTER TABLE "CategoryExtra" DROP CONSTRAINT "CategoryExtra_extra_id_fkey";

-- DropForeignKey
ALTER TABLE "CategorySize" DROP CONSTRAINT "CategorySize_category_id_fkey";

-- DropForeignKey
ALTER TABLE "CategorySize" DROP CONSTRAINT "CategorySize_size_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_delivery_boy_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_order_id_fkey";

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

-- DropIndex
DROP INDEX "Payment_order_id_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "building_number",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "buildingNumber" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CategoryExtra" DROP CONSTRAINT "CategoryExtra_pkey",
DROP COLUMN "category_id",
DROP COLUMN "extra_id",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "extraId" TEXT NOT NULL,
ADD CONSTRAINT "CategoryExtra_pkey" PRIMARY KEY ("categoryId", "extraId");

-- AlterTable
ALTER TABLE "CategorySize" DROP CONSTRAINT "CategorySize_pkey",
DROP COLUMN "category_id",
DROP COLUMN "size_id",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "sizeId" TEXT NOT NULL,
ADD CONSTRAINT "CategorySize_pkey" PRIMARY KEY ("categoryId", "sizeId");

-- AlterTable
ALTER TABLE "Extra" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "building_number",
DROP COLUMN "created_at",
DROP COLUMN "delivery_boy_id",
DROP COLUMN "delivery_fee",
DROP COLUMN "total_price",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "buildingNumber" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryBoyId" TEXT,
ADD COLUMN     "deliveryFee" DECIMAL(65,30),
ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
DROP COLUMN "created_at",
DROP COLUMN "orderItem_id",
DROP COLUMN "order_id",
DROP COLUMN "product_id",
DROP COLUMN "total_price",
DROP COLUMN "unit_price",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "orderItemId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemId");

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "created_at",
DROP COLUMN "order_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductExtra" DROP CONSTRAINT "ProductExtra_pkey",
DROP COLUMN "created_at",
DROP COLUMN "extra_id",
DROP COLUMN "product_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "extraId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ProductExtra_pkey" PRIMARY KEY ("extraId", "productId");

-- AlterTable
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_pkey",
DROP COLUMN "created_at",
DROP COLUMN "product_id",
DROP COLUMN "size_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "sizeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("sizeId", "productId");

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "primary_phone",
DROP COLUMN "secondary_phone",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "primaryPhone" TEXT NOT NULL,
ADD COLUMN     "secondaryPhone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductExtra" ADD CONSTRAINT "ProductExtra_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductExtra" ADD CONSTRAINT "ProductExtra_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtra" ADD CONSTRAINT "CategoryExtra_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtra" ADD CONSTRAINT "CategoryExtra_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryBoyId_fkey" FOREIGN KEY ("deliveryBoyId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
