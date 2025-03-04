/*
  Warnings:

  - You are about to drop the column `bannerIamgeUrl` on the `Intro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Intro` DROP COLUMN `bannerIamgeUrl`,
    ADD COLUMN `bannerImageUrl` VARCHAR(191) NULL;
