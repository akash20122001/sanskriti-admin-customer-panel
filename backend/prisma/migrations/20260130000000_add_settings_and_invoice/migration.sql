-- CreateTable
CREATE TABLE `Settings` (
    `id` VARCHAR(191) NOT NULL,
    `companyPan` VARCHAR(191) NOT NULL,
    `companyGst` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `Bill` ADD COLUMN `invoiceNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Bill_invoiceNumber_key` ON `Bill`(`invoiceNumber`);
