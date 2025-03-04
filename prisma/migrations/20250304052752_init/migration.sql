/*
  Warnings:

  - You are about to drop the column `reusmeFileUrl` on the `Intro` table. All the data in the column will be lost.
  - Added the required column `resumeFileUrl` to the `Intro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Intro` DROP COLUMN `reusmeFileUrl`,
    ADD COLUMN `resumeFileUrl` VARCHAR(191) NOT NULL;

INSERT INTO `Intro` (`id`, `title`, `description`, `resumeFileUrl`, `bannerIamgeUrl`, `createdAt`, `updatedAt`)
    SELECT 1, '', '', '', '', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM `Intro` LIMIT 1);