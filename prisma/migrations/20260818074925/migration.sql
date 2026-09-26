/*
  Warnings:

  - The values [PENDING,FAILED,REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DELIVERY_BOY] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `apartment` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `buildingNumber` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `governorate` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `apartment` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `buildingNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryBoyId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `governorate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PAID', 'NOT_PAID');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'NOT_PAID';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CUSTOMER', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryBoyId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "apartment",
DROP COLUMN "area",
DROP COLUMN "buildingNumber",
DROP COLUMN "floor",
DROP COLUMN "governorate",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postalCode" INTEGER;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "apartment",
DROP COLUMN "area",
DROP COLUMN "buildingNumber",
DROP COLUMN "deliveryBoyId",
DROP COLUMN "floor",
DROP COLUMN "governorate",
DROP COLUMN "status",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postalCode" INTEGER,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "street" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'NOT_PAID';

-- DropEnum
DROP TYPE "OrderStatus";
