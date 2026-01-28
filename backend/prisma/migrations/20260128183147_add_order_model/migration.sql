-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `skuId` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `currency` ENUM('USD', 'INR') NOT NULL,
    `platform` ENUM('Amazon', 'Flipkart', 'Meesho', 'Etsy') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_orderId_key`(`orderId`),
    INDEX `Order_userId_idx`(`userId`),
    INDEX `Order_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
