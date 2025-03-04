/*
  Warnings:

  - The primary key for the `Intro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Intro` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Intro` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

INSERT INTO `Intro` (`id`, `title`, `description`, `reusmeFileUrl`, `bannerIamgeUrl`, `createdAt`, `updatedAt`)
SELECT 1, '', '', '', '', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `Intro` LIMIT 1);