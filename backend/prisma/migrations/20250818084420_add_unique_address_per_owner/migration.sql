/*
  Warnings:

  - A unique constraint covering the columns `[user_id,address]` on the table `apartments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "apartments_user_id_address_key" ON "public"."apartments"("user_id", "address");
