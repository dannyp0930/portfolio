/*
  Warnings:

  - You are about to drop the column `degreeProgram` on the `Education` table. All the data in the column will be lost.
  - Added the required column `degreeStatus` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Education` DROP COLUMN `degreeProgram`,
    ADD COLUMN `degreeStatus` VARCHAR(191) NOT NULL;
