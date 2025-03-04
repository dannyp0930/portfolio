/*
  Warnings:

  - Added the required column `bannerIamgeUrl` to the `Intro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reusmeFileUrl` to the `Intro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Intro` ADD COLUMN `bannerIamgeUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `reusmeFileUrl` VARCHAR(191) NOT NULL;
