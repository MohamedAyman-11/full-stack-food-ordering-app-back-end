/*
  Warnings:

  - You are about to drop the column `firstName` on the `DeliveryBoy` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `DeliveryBoy` table. All the data in the column will be lost.
  - Added the required column `name` to the `DeliveryBoy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryBoy" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;
