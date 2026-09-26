/*
  Warnings:

  - Made the column `city` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postalCode` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "postalCode" SET NOT NULL,
ALTER COLUMN "postalCode" SET DATA TYPE TEXT;
