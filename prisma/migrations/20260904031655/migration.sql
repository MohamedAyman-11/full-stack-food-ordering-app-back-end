/*
  Warnings:

  - The values [NOT_PAID] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `paymentMethod` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'CONFIRMED', 'ASSIGNED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT', 'ON_DELIVERY');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'FAILED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PLACED',
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
