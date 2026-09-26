/*
  Warnings:

  - The values [SUSPENDED] on the enum `DeliveryBoyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeliveryBoyStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "public"."DeliveryBoy" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "DeliveryBoy" ALTER COLUMN "status" TYPE "DeliveryBoyStatus_new" USING ("status"::text::"DeliveryBoyStatus_new");
ALTER TYPE "DeliveryBoyStatus" RENAME TO "DeliveryBoyStatus_old";
ALTER TYPE "DeliveryBoyStatus_new" RENAME TO "DeliveryBoyStatus";
DROP TYPE "public"."DeliveryBoyStatus_old";
ALTER TABLE "DeliveryBoy" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
