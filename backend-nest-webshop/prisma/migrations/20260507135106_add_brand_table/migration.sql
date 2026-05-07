-- AlterTable
ALTER TABLE `shop_products` ADD COLUMN `brand_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `shop_brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `logo_url` VARCHAR(255) NULL,
    `website_url` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_brand_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `shop_products_brand_id_idx` ON `shop_products`(`brand_id`);

-- AddForeignKey
ALTER TABLE `shop_products` ADD CONSTRAINT `shop_products_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `shop_brand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
