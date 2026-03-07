-- =========================================================
-- V1: Initial Schema for Sanskriti Backend (Spring Boot)
-- All tables match Spring Boot JPA entities exactly.
-- =========================================================

-- Users
CREATE TABLE `user` (
    `id`             VARCHAR(191) NOT NULL,
    `userId`         VARCHAR(191) NOT NULL,
    `name`           VARCHAR(191) NOT NULL,
    `password`       VARCHAR(191) NOT NULL,
    `role`           ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    `walletBalance`  DOUBLE       NOT NULL DEFAULT 0,
    `isActive`       TINYINT(1)   NOT NULL DEFAULT 1,
    `company`        VARCHAR(191)          DEFAULT NULL,
    `companyAddress` VARCHAR(191)          DEFAULT NULL,
    `email`          VARCHAR(191)          DEFAULT NULL,
    `gst`            VARCHAR(191)          DEFAULT NULL,
    `phone`          VARCHAR(191)          DEFAULT NULL,
    `pin`            VARCHAR(191)          DEFAULT NULL,
    `state`          VARCHAR(191)          DEFAULT NULL,
    `createdAt`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_userId_uq` (`userId`),
    INDEX `user_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders
CREATE TABLE `order` (
    `id`              VARCHAR(191) NOT NULL,
    `orderId`         VARCHAR(191) NOT NULL,
    `userId`          VARCHAR(191) NOT NULL,
    `skuId`           VARCHAR(191) NOT NULL,
    `price`           DOUBLE       NOT NULL,
    `currency`        ENUM('USD', 'INR') NOT NULL DEFAULT 'INR',
    `platform`        VARCHAR(191) NOT NULL,
    `status`          ENUM('IN_PROGRESS', 'SHIPPED', 'RTO') NOT NULL DEFAULT 'IN_PROGRESS',
    `deliveryPartner` VARCHAR(191)          DEFAULT NULL,
    `trackingId`      VARCHAR(191)          DEFAULT NULL,
    `orderDate`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `order_orderId_uq` (`orderId`),
    INDEX `order_userId_idx` (`userId`),
    INDEX `order_orderId_idx` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings (singleton table — only one row expected)
CREATE TABLE `settings` (
    `id`               VARCHAR(191) NOT NULL,
    `companyPan`       VARCHAR(191) NOT NULL DEFAULT 'CANPJ8390R',
    `companyGst`       VARCHAR(191) NOT NULL DEFAULT '08CANPJ3390R1ZT',
    `deliveryPartners` JSON         NOT NULL,
    `sellingPlatforms` JSON         NOT NULL,
    `updatedAt`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions
CREATE TABLE `transaction` (
    `id`            VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `userId`        VARCHAR(191) NOT NULL,
    `amount`        DOUBLE       NOT NULL,
    `type`          ENUM('CREDIT', 'DEBIT') NOT NULL,
    `status`        ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `description`   VARCHAR(191)          DEFAULT NULL,
    `createdAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `transaction_transactionId_uq` (`transactionId`),
    INDEX `transaction_userId_idx` (`userId`),
    INDEX `transaction_transactionId_idx` (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bills (PDF invoice records)
CREATE TABLE `bill` (
    `id`              VARCHAR(191) NOT NULL,
    `transactionId`   VARCHAR(191) NOT NULL,
    `userId`          VARCHAR(191)          DEFAULT NULL,
    `invoiceNumber`   VARCHAR(191)          DEFAULT NULL,
    `transactionDate` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `company`         VARCHAR(191) NOT NULL,
    `email`           VARCHAR(191) NOT NULL,
    `phone`           VARCHAR(191) NOT NULL,
    `companyAddress`  VARCHAR(191) NOT NULL,
    `state`           VARCHAR(191) NOT NULL,
    `pin`             VARCHAR(191) NOT NULL,
    `gst`             VARCHAR(191) NOT NULL,
    `paymentMode`     VARCHAR(191) NOT NULL DEFAULT 'Razorpay Wallet',
    `productName`     VARCHAR(191) NOT NULL,
    `skuId`           VARCHAR(191) NOT NULL,
    `quantity`        INT          NOT NULL,
    `price`           DOUBLE       NOT NULL,
    `currency`        ENUM('USD', 'INR') NOT NULL,
    `shippingCharge`  DOUBLE       NOT NULL,
    `packagingCharge` DOUBLE       NOT NULL DEFAULT 0,
    `taxPercent`      DOUBLE       NOT NULL,
    `payableAmount`   DOUBLE       NOT NULL,
    `invoiceUrl`      VARCHAR(191)          DEFAULT NULL,
    `createdAt`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `bill_transactionId_uq` (`transactionId`),
    UNIQUE KEY `bill_invoiceNumber_uq` (`invoiceNumber`),
    INDEX `bill_transactionId_idx` (`transactionId`),
    INDEX `bill_company_idx` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
