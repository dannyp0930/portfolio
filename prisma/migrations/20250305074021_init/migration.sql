/*
  Warnings:

  - Made the column `bannerImageUrl` on table `Intro` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Intro` ADD COLUMN `bannerImageUrlMobile` VARCHAR(191) NULL,
    ADD COLUMN `bannerImageUrlTablet` VARCHAR(191) NULL,
    MODIFY `bannerImageUrl` VARCHAR(191) NOT NULL;
