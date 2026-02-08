/*
  Warnings:

  - You are about to alter the column `platform` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `deliveryPartner` VARCHAR(191) NULL,
    ADD COLUMN `trackingId` VARCHAR(191) NULL,
    MODIFY `platform` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `settings` ADD COLUMN `deliveryPartners` JSON NOT NULL,
    ADD COLUMN `sellingPlatforms` JSON NOT NULL;
