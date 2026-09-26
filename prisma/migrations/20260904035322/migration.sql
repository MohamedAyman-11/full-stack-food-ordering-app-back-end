/*
  Warnings:

  - You are about to drop the column `orderStatus` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PLACED',
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "orderStatus",
DROP COLUMN "paymentMethod";
