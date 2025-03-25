/*
  Warnings:

  - You are about to drop the column `subject` on the `MailLog` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `MailLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MailLog` DROP COLUMN `subject`,
    DROP COLUMN `text`;
