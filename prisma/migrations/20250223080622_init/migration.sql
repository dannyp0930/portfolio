/*
  Warnings:

  - A unique constraint covering the columns `[careerId]` on the table `CareerDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `ProjectDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProjectDetail_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `projectDetailId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CareerDetail_careerId_key` ON `CareerDetail`(`careerId`);

-- AddForeignKey
ALTER TABLE `ProjectDetail` ADD CONSTRAINT `ProjectDetail_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectImage` ADD CONSTRAINT `ProjectImage_projectDetailId_fkey` FOREIGN KEY (`projectDetailId`) REFERENCES `ProjectDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
