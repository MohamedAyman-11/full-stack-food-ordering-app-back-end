/*
  Warnings:

  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "CategorySize" (
    "categoryId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,

    CONSTRAINT "CategorySize_pkey" PRIMARY KEY ("categoryId","sizeId")
);

-- CreateTable
CREATE TABLE "CategoryExtra" (
    "categoryId" TEXT NOT NULL,
    "extraId" TEXT NOT NULL,

    CONSTRAINT "CategoryExtra_pkey" PRIMARY KEY ("categoryId","extraId")
);

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySize" ADD CONSTRAINT "CategorySize_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtra" ADD CONSTRAINT "CategoryExtra_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryExtra" ADD CONSTRAINT "CategoryExtra_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
