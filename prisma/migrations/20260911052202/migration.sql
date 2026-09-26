-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "deliveryBoyId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_deliveryBoyId_fkey" FOREIGN KEY ("deliveryBoyId") REFERENCES "DeliveryBoy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
