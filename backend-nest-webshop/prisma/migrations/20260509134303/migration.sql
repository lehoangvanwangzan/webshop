/*
  Warnings:

  - You are about to drop the column `parent_id` on the `shop_categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `shop_categories` DROP FOREIGN KEY `shop_categories_parent_id_fkey`;

-- DropIndex
DROP INDEX `shop_categories_parent_id_fkey` ON `shop_categories`;

-- AlterTable
ALTER TABLE `shop_categories` DROP COLUMN `parent_id`;

-- CreateTable
CREATE TABLE `shop_child_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_child_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shop_child_categories` ADD CONSTRAINT `shop_child_categories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `shop_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
