-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `type` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Transaction_transactionId_key`(`transactionId`),
    INDEX `Transaction_userId_idx`(`userId`),
    INDEX `Transaction_transactionId_idx`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
