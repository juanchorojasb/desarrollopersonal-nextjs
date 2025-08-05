/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `marketingOptIn` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `plans` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `monthlyPrice` INTEGER NOT NULL,
    `quarterlyPrice` INTEGER NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'COP',
    `features` JSON NOT NULL,
    `maxCourses` INTEGER NOT NULL DEFAULT -1,
    `hasLiveWorkshops` BOOLEAN NOT NULL DEFAULT false,
    `hasSupport` BOOLEAN NOT NULL DEFAULT false,
    `hasCertificates` BOOLEAN NOT NULL DEFAULT false,
    `hasCoaching` BOOLEAN NOT NULL DEFAULT false,
    `stripeProductId` VARCHAR(191) NULL,
    `stripeMonthlyPriceId` VARCHAR(191) NULL,
    `stripeQuarterlyPriceId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `plans_name_key`(`name`),
    UNIQUE INDEX `plans_stripeProductId_key`(`stripeProductId`),
    UNIQUE INDEX `plans_stripeMonthlyPriceId_key`(`stripeMonthlyPriceId`),
    UNIQUE INDEX `plans_stripeQuarterlyPriceId_key`(`stripeQuarterlyPriceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'TRIAL', 'PAST_DUE', 'CANCELED', 'UNPAID', 'INCOMPLETE') NOT NULL DEFAULT 'PENDING',
    `billingCycle` ENUM('MONTHLY', 'QUARTERLY') NOT NULL DEFAULT 'MONTHLY',
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `trialEndDate` DATETIME(3) NULL,
    `stripeSubscriptionId` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `currentPeriodStart` DATETIME(3) NULL,
    `currentPeriodEnd` DATETIME(3) NULL,
    `priceAmount` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'COP',
    `cancelAtPeriodEnd` BOOLEAN NOT NULL DEFAULT false,
    `canceledAt` DATETIME(3) NULL,
    `cancelReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscriptions_stripeSubscriptionId_key`(`stripeSubscriptionId`),
    INDEX `subscriptions_userId_idx`(`userId`),
    INDEX `subscriptions_status_idx`(`status`),
    INDEX `subscriptions_stripeSubscriptionId_idx`(`stripeSubscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'COP',
    `status` ENUM('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `stripePaymentIntentId` VARCHAR(191) NULL,
    `stripeChargeId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `failureReason` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payments_stripePaymentIntentId_key`(`stripePaymentIntentId`),
    UNIQUE INDEX `payments_stripeChargeId_key`(`stripeChargeId`),
    INDEX `payments_subscriptionId_idx`(`subscriptionId`),
    INDEX `payments_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `live_workshops` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `scheduledAt` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `status` ENUM('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELED') NOT NULL DEFAULT 'SCHEDULED',
    `requiredPlans` JSON NOT NULL,
    `streamUrl` VARCHAR(191) NULL,
    `recordingUrl` VARCHAR(191) NULL,
    `instructorName` VARCHAR(191) NOT NULL,
    `instructorBio` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workshop_attendees` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `workshopId` VARCHAR(191) NOT NULL,
    `status` ENUM('REGISTERED', 'ATTENDED', 'NO_SHOW') NOT NULL DEFAULT 'REGISTERED',
    `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `attendedAt` DATETIME(3) NULL,

    UNIQUE INDEX `workshop_attendees_userId_workshopId_key`(`userId`, `workshopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_stripeCustomerId_key` ON `users`(`stripeCustomerId`);

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workshop_attendees` ADD CONSTRAINT `workshop_attendees_workshopId_fkey` FOREIGN KEY (`workshopId`) REFERENCES `live_workshops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
