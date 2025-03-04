-- AlterTable
ALTER TABLE `Intro` MODIFY `bannerIamgeUrl` VARCHAR(191) NULL,
    MODIFY `resumeFileUrl` VARCHAR(191) NULL;

INSERT INTO `Intro` (`id`, `title`, `description`, `createdAt`, `updatedAt`)
    SELECT 1, '', '', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM `Intro` LIMIT 1);