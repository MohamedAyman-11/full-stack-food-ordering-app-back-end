/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `CategoryExtra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategorySize` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryExtra" DROP CONSTRAINT "CategoryExtra_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryExtra" DROP CONSTRAINT "CategoryExtra_extraId_fkey";

-- DropForeignKey
ALTER TABLE "CategorySize" DROP CONSTRAINT "CategorySize_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategorySize" DROP CONSTRAINT "CategorySize_sizeId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price";

-- DropTable
DROP TABLE "CategoryExtra";

-- DropTable
DROP TABLE "CategorySize";
