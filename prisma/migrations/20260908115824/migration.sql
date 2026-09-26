/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `DeliveryBoy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DeliveryBoy_phone_key" ON "DeliveryBoy"("phone");
