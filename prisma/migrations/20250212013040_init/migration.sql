/*
  Warnings:

  - You are about to drop the column `period` on the `Career` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Career` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Career` DROP COLUMN `period`,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `CareerOverview` MODIFY `endDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Skill` ADD COLUMN `imageUrl` VARCHAR(191) NOT NULL;
