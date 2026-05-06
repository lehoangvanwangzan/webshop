-- CreateTable
CREATE TABLE `shop_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `role` ENUM('admin', 'staff', 'customer') NOT NULL DEFAULT 'customer',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `avatar_url` VARCHAR(255) NULL,
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `date_of_birth` DATE NULL,
    `gender` ENUM('male', 'female', 'other') NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `district` VARCHAR(100) NULL,
    `ward` VARCHAR(100) NULL,
    `total_orders` INTEGER NOT NULL DEFAULT 0,
    `total_spent` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_customers_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(255) NULL,
    `parent_id` INTEGER NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `description` TEXT NULL,
    `short_description` VARCHAR(500) NULL,
    `sku` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discount_price` DECIMAL(10, 2) NULL,
    `cost_price` DECIMAL(10, 2) NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `weight` DECIMAL(10, 2) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `supplier_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_products_slug_key`(`slug`),
    UNIQUE INDEX `shop_products_sku_key`(`sku`),
    INDEX `shop_products_category_id_idx`(`category_id`),
    INDEX `shop_products_is_active_is_featured_idx`(`is_active`, `is_featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_product_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `alt_text` VARCHAR(255) NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_product_images_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `order_number` VARCHAR(50) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `billing_address` TEXT NULL,
    `notes` TEXT NULL,
    `coupon_id` INTEGER NULL,
    `paid_at` DATETIME(3) NULL,
    `cancelled_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_orders_order_number_key`(`order_number`),
    INDEX `shop_orders_customer_id_idx`(`customer_id`),
    INDEX `shop_orders_status_idx`(`status`),
    INDEX `shop_orders_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_order_details_order_id_idx`(`order_id`),
    INDEX `shop_order_details_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_shipping_providers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider_name` VARCHAR(100) NOT NULL,
    `provider_code` VARCHAR(50) NOT NULL,
    `api_endpoint` VARCHAR(255) NULL,
    `api_key` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `base_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_shipping_providers_provider_code_key`(`provider_code`),
    INDEX `shop_shipping_providers_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_shipping_methods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider_id` INTEGER NOT NULL,
    `method_name` VARCHAR(100) NOT NULL,
    `estimated_days` INTEGER NULL,
    `fee_formula` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_shipments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `shipping_method_id` INTEGER NOT NULL,
    `provider_id` INTEGER NOT NULL,
    `tracking_number` VARCHAR(100) NOT NULL,
    `sender_address` TEXT NULL,
    `recipient_address` TEXT NULL,
    `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `weight` DECIMAL(10, 2) NULL,
    `dimensions` JSON NULL,
    `shipped_date` DATETIME(3) NULL,
    `expected_delivery_date` DATETIME(3) NULL,
    `actual_delivery_date` DATETIME(3) NULL,
    `status` ENUM('pending', 'picked_up', 'in_transit', 'delivered', 'failed') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_shipments_tracking_number_key`(`tracking_number`),
    INDEX `shop_shipments_status_idx`(`status`),
    INDEX `shop_shipments_shipped_date_idx`(`shipped_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_shipment_tracking` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `shipment_id` INTEGER NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `location` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_shipment_tracking_shipment_id_idx`(`shipment_id`),
    INDEX `shop_shipment_tracking_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_return_reasons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_return_reasons_reason_name_key`(`reason_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_return_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `return_reason_id` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'received', 'refunded') NOT NULL DEFAULT 'pending',
    `requested_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approved_date` DATETIME(3) NULL,
    `estimated_return_date` DATETIME(3) NULL,
    `received_date` DATETIME(3) NULL,
    `refunded_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shop_return_requests_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_return_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `return_request_id` INTEGER NOT NULL,
    `order_item_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `condition` ENUM('new', 'used', 'damaged') NOT NULL DEFAULT 'used',
    `refund_amount` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_refunds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `return_request_id` INTEGER NOT NULL,
    `order_id` INTEGER NOT NULL,
    `refund_amount` DECIMAL(10, 2) NOT NULL,
    `refund_method` ENUM('original_payment', 'store_credit', 'bank_transfer') NOT NULL,
    `transaction_id` VARCHAR(100) NULL,
    `status` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    `refund_date` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_stores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_stores_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_inventory_stocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `current_stock` INTEGER NOT NULL DEFAULT 0,
    `reserved_stock` INTEGER NOT NULL DEFAULT 0,
    `min_stock_level` INTEGER NOT NULL DEFAULT 0,
    `reorder_point` INTEGER NOT NULL DEFAULT 0,
    `reorder_quantity` INTEGER NOT NULL DEFAULT 0,
    `last_stock_check` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shop_inventory_stocks_current_stock_idx`(`current_stock`),
    UNIQUE INDEX `shop_inventory_stocks_product_id_store_id_key`(`product_id`, `store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_inventory_movements` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `movement_type` ENUM('import', 'export', 'sale', 'return', 'adjustment', 'damage') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `reference_id` INTEGER NULL,
    `reference_type` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_inventory_movements_movement_type_idx`(`movement_type`),
    INDEX `shop_inventory_movements_product_id_store_id_created_at_idx`(`product_id`, `store_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_stock_alerts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `alert_type` ENUM('low_stock', 'overstock', 'expiring_soon') NOT NULL,
    `current_stock` INTEGER NOT NULL,
    `threshold` INTEGER NOT NULL,
    `is_resolved` BOOLEAN NOT NULL DEFAULT false,
    `resolved_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shop_stock_alerts_alert_type_idx`(`alert_type`),
    INDEX `shop_stock_alerts_is_resolved_idx`(`is_resolved`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_carts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NULL,
    `session_id` VARCHAR(100) NULL,
    `status` ENUM('active', 'abandoned', 'converted') NOT NULL DEFAULT 'active',
    `total_items` INTEGER NOT NULL DEFAULT 0,
    `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `abandoned_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shop_carts_customer_id_idx`(`customer_id`),
    INDEX `shop_carts_session_id_idx`(`session_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_cart_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cart_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_cart_items_cart_id_product_id_key`(`cart_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_wishlists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `wishlist_name` VARCHAR(100) NOT NULL DEFAULT 'My Wishlist',
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `visibility_link` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_wishlist_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wishlist_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_wishlist_items_wishlist_id_product_id_key`(`wishlist_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_notifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('order', 'shipment', 'review', 'promotion', 'system') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `related_id` INTEGER NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `read_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_notifications_user_id_is_read_idx`(`user_id`, `is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_email_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `template_name` VARCHAR(100) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `variables` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_email_templates_template_name_key`(`template_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_email_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NULL,
    `template_id` INTEGER NOT NULL,
    `recipient_email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `status` ENUM('pending', 'sent', 'bounced', 'failed') NOT NULL DEFAULT 'pending',
    `sent_at` DATETIME(3) NULL,
    `error_message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_email_logs_customer_id_idx`(`customer_id`),
    INDEX `shop_email_logs_status_idx`(`status`),
    INDEX `shop_email_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_product_price_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `old_price` DECIMAL(10, 2) NOT NULL,
    `new_price` DECIMAL(10, 2) NOT NULL,
    `discount_price` DECIMAL(10, 2) NULL,
    `reason` VARCHAR(255) NULL,
    `effective_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `changed_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_product_price_history_product_id_idx`(`product_id`),
    INDEX `shop_product_price_history_effective_date_idx`(`effective_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_bulk_pricing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `min_quantity` INTEGER NOT NULL,
    `max_quantity` INTEGER NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_order_analytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `order_id` INTEGER NULL,
    `total_orders` INTEGER NOT NULL DEFAULT 0,
    `total_revenue` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `average_order_value` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `unique_customers` INTEGER NOT NULL DEFAULT 0,
    `new_customers` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_order_analytics_date_key`(`date`),
    UNIQUE INDEX `shop_order_analytics_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_product_analytics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `add_to_cart_count` INTEGER NOT NULL DEFAULT 0,
    `purchase_count` INTEGER NOT NULL DEFAULT 0,
    `revenue` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `conversion_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_product_analytics_product_id_date_key`(`product_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_customer_analytics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `purchase_count` INTEGER NOT NULL DEFAULT 0,
    `total_spent` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `average_order_value` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `last_purchase_date` DATE NULL,
    `days_since_last_purchase` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_customer_analytics_customer_id_date_key`(`customer_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_audit_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(100) NOT NULL,
    `entity_id` INTEGER NOT NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `shop_audit_logs_user_id_idx`(`user_id`),
    INDEX `shop_audit_logs_action_idx`(`action`),
    INDEX `shop_audit_logs_entity_type_entity_id_created_at_idx`(`entity_type`, `entity_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_system_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `setting_key` VARCHAR(100) NOT NULL,
    `setting_value` LONGTEXT NOT NULL,
    `data_type` ENUM('string', 'number', 'boolean', 'json') NOT NULL,
    `description` TEXT NULL,
    `updated_by` INTEGER NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_system_settings_setting_key_key`(`setting_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_tax_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `region` VARCHAR(100) NOT NULL,
    `tax_rate` DECIMAL(5, 2) NOT NULL,
    `tax_name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_tax_settings_region_key`(`region`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `contact_person` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `tax_id` VARCHAR(50) NULL,
    `payment_terms` VARCHAR(50) NULL,
    `lead_time_days` INTEGER NULL,
    `min_order_qty` INTEGER NULL,
    `rating` DECIMAL(3, 2) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_supplier_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `supplier_product_code` VARCHAR(100) NULL,
    `supplier_price` DECIMAL(10, 2) NOT NULL,
    `moq` INTEGER NOT NULL DEFAULT 1,
    `lead_time` INTEGER NULL,
    `availability` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_supplier_products_supplier_id_product_id_key`(`supplier_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_supplier_performance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `total_orders` INTEGER NOT NULL DEFAULT 0,
    `on_time_delivery_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `quality_score` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `price_competitiveness` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_supplier_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_id` INTEGER NOT NULL,
    `payment_amount` DECIMAL(12, 2) NOT NULL,
    `payment_method` ENUM('bank_transfer', 'check', 'credit') NOT NULL,
    `payment_date` DATETIME(3) NULL,
    `due_date` DATETIME(3) NULL,
    `status` ENUM('pending', 'paid', 'overdue') NOT NULL DEFAULT 'pending',
    `reference_number` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_warehouses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `warehouse_code` VARCHAR(50) NOT NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `capacity` INTEGER NULL,
    `manager_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_warehouses_warehouse_code_key`(`warehouse_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_warehouse_zones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `warehouse_id` INTEGER NOT NULL,
    `zone_name` VARCHAR(50) NOT NULL,
    `zone_code` VARCHAR(50) NOT NULL,
    `rack_count` INTEGER NOT NULL DEFAULT 0,
    `shelf_count` INTEGER NOT NULL DEFAULT 0,
    `capacity` INTEGER NULL,
    `current_usage` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_warehouse_zones_zone_code_key`(`zone_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_warehouse_racks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `zone_id` INTEGER NOT NULL,
    `rack_number` VARCHAR(50) NOT NULL,
    `rack_code` VARCHAR(50) NOT NULL,
    `shelf_count` INTEGER NOT NULL DEFAULT 0,
    `capacity` INTEGER NULL,
    `current_load` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('active', 'maintenance', 'full') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_warehouse_racks_rack_code_key`(`rack_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_warehouse_locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rack_id` INTEGER NOT NULL,
    `shelf_number` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `last_updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_warehouse_locations_rack_id_shelf_number_product_id_key`(`rack_id`, `shelf_number`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_warehouse_transfers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_warehouse_id` INTEGER NOT NULL,
    `to_warehouse_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `transfer_date` DATETIME(3) NOT NULL,
    `arrival_date` DATETIME(3) NULL,
    `status` ENUM('pending', 'in_transit', 'received') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_product_reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `order_id` INTEGER NULL,
    `rating` TINYINT NOT NULL,
    `title` VARCHAR(255) NULL,
    `content` TEXT NULL,
    `helpful_count` INTEGER NOT NULL DEFAULT 0,
    `unhelpful_count` INTEGER NOT NULL DEFAULT 0,
    `verified_purchase` BOOLEAN NOT NULL DEFAULT false,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shop_product_reviews_product_id_idx`(`product_id`),
    INDEX `shop_product_reviews_customer_id_idx`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_review_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `review_id` INTEGER NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_review_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `review_id` INTEGER NOT NULL,
    `responder_id` INTEGER NOT NULL,
    `response_text` TEXT NOT NULL,
    `response_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_product_rating_summary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `average_rating` DECIMAL(3, 2) NOT NULL DEFAULT 0,
    `total_reviews` INTEGER NOT NULL DEFAULT 0,
    `rating_5_count` INTEGER NOT NULL DEFAULT 0,
    `rating_4_count` INTEGER NOT NULL DEFAULT 0,
    `rating_3_count` INTEGER NOT NULL DEFAULT 0,
    `rating_2_count` INTEGER NOT NULL DEFAULT 0,
    `rating_1_count` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_product_rating_summary_product_id_key`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_customer_segments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `segment_name` VARCHAR(100) NOT NULL,
    `segment_code` VARCHAR(50) NOT NULL,
    `criteria_json` JSON NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_customer_segments_segment_code_key`(`segment_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_customer_segment_assignments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `segment_id` INTEGER NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_customer_segment_assignments_customer_id_segment_id_key`(`customer_id`, `segment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_loyalty_programs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `program_name` VARCHAR(100) NOT NULL,
    `program_code` VARCHAR(50) NOT NULL,
    `tier_count` INTEGER NOT NULL DEFAULT 1,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_loyalty_programs_program_code_key`(`program_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_loyalty_tiers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `program_id` INTEGER NOT NULL,
    `tier_name` VARCHAR(100) NOT NULL,
    `tier_level` INTEGER NOT NULL,
    `min_points` INTEGER NOT NULL,
    `max_points` INTEGER NULL,
    `benefits_json` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_customer_loyalty_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `program_id` INTEGER NOT NULL,
    `current_tier_id` INTEGER NOT NULL,
    `total_points` INTEGER NOT NULL DEFAULT 0,
    `used_points` INTEGER NOT NULL DEFAULT 0,
    `last_transaction_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_customer_loyalty_accounts_customer_id_key`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_loyalty_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `program_id` INTEGER NOT NULL,
    `transaction_type` ENUM('earn', 'redeem', 'expire', 'adjustment') NOT NULL,
    `points_change` INTEGER NOT NULL,
    `reason` VARCHAR(255) NULL,
    `reference_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_campaigns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_name` VARCHAR(255) NOT NULL,
    `campaign_code` VARCHAR(100) NOT NULL,
    `campaign_type` ENUM('email', 'sms', 'push', 'seasonal') NOT NULL,
    `status` ENUM('draft', 'scheduled', 'active', 'paused', 'ended') NOT NULL DEFAULT 'draft',
    `target_segment_id` INTEGER NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `budget` DECIMAL(12, 2) NULL,
    `expected_roi` DECIMAL(5, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_campaigns_campaign_code_key`(`campaign_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_campaign_emails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `email_template_id` INTEGER NOT NULL,
    `scheduled_send_time` DATETIME(3) NULL,
    `sent_count` INTEGER NOT NULL DEFAULT 0,
    `open_count` INTEGER NOT NULL DEFAULT 0,
    `click_count` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('pending', 'sent', 'bounced', 'failed') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_coupons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coupon_code` VARCHAR(100) NOT NULL,
    `campaign_id` INTEGER NULL,
    `discount_type` ENUM('percentage', 'fixed_amount') NOT NULL,
    `discount_value` DECIMAL(10, 2) NOT NULL,
    `max_discount_amount` DECIMAL(10, 2) NULL,
    `min_purchase_amount` DECIMAL(10, 2) NULL,
    `max_usage_count` INTEGER NULL,
    `current_usage_count` INTEGER NOT NULL DEFAULT 0,
    `validity_start` DATETIME(3) NULL,
    `validity_end` DATETIME(3) NULL,
    `applicable_products_json` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_coupons_coupon_code_key`(`coupon_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_coupon_redemptions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `coupon_id` INTEGER NOT NULL,
    `order_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL,
    `redemption_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_campaign_performance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaign_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `impressions` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `conversions` INTEGER NOT NULL DEFAULT 0,
    `revenue` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `cost` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shop_campaign_performance_campaign_id_date_key`(`campaign_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_payment_methods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `method_code` VARCHAR(50) NOT NULL,
    `method_name` VARCHAR(100) NOT NULL,
    `provider` VARCHAR(100) NULL,
    `provider_account_id` VARCHAR(100) NULL,
    `api_key_encrypted` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_payment_methods_method_code_key`(`method_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `payment_method_id` INTEGER NOT NULL,
    `transaction_amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'VND',
    `transaction_type` ENUM('payment', 'refund', 'reversal') NOT NULL,
    `status` ENUM('pending', 'processing', 'success', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
    `provider_transaction_id` VARCHAR(100) NULL,
    `reference_number` VARCHAR(100) NULL,
    `authorization_code` VARCHAR(100) NULL,
    `response_code` VARCHAR(50) NULL,
    `error_message` TEXT NULL,
    `transaction_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `shop_transactions_order_id_idx`(`order_id`),
    INDEX `shop_transactions_status_idx`(`status`),
    INDEX `shop_transactions_transaction_date_idx`(`transaction_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_payment_reconciliation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_batch_date` DATE NOT NULL,
    `payment_method_id` INTEGER NOT NULL,
    `expected_amount` DECIMAL(12, 2) NOT NULL,
    `received_amount` DECIMAL(12, 2) NOT NULL,
    `reconciliation_status` ENUM('pending', 'matched', 'under_review') NOT NULL DEFAULT 'pending',
    `reconciled_by` INTEGER NULL,
    `reconciliation_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `shop_payment_reconciliation_payment_batch_date_payment_metho_key`(`payment_batch_date`, `payment_method_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_transaction_disputes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` BIGINT NOT NULL,
    `dispute_reason` VARCHAR(255) NULL,
    `dispute_amount` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('open', 'under_investigation', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    `filed_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolved_date` DATETIME(3) NULL,
    `resolution_notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shop_customers` ADD CONSTRAINT `shop_customers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `shop_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_categories` ADD CONSTRAINT `shop_categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `shop_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_products` ADD CONSTRAINT `shop_products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `shop_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_products` ADD CONSTRAINT `shop_products_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `shop_suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_product_images` ADD CONSTRAINT `shop_product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_orders` ADD CONSTRAINT `shop_orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_orders` ADD CONSTRAINT `shop_orders_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `shop_coupons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_order_details` ADD CONSTRAINT `shop_order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `shop_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_order_details` ADD CONSTRAINT `shop_order_details_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_shipping_methods` ADD CONSTRAINT `shop_shipping_methods_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `shop_shipping_providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_shipments` ADD CONSTRAINT `shop_shipments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `shop_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_shipments` ADD CONSTRAINT `shop_shipments_shipping_method_id_fkey` FOREIGN KEY (`shipping_method_id`) REFERENCES `shop_shipping_methods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_shipments` ADD CONSTRAINT `shop_shipments_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `shop_shipping_providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_shipment_tracking` ADD CONSTRAINT `shop_shipment_tracking_shipment_id_fkey` FOREIGN KEY (`shipment_id`) REFERENCES `shop_shipments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_return_requests` ADD CONSTRAINT `shop_return_requests_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `shop_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_return_requests` ADD CONSTRAINT `shop_return_requests_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_return_requests` ADD CONSTRAINT `shop_return_requests_return_reason_id_fkey` FOREIGN KEY (`return_reason_id`) REFERENCES `shop_return_reasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_return_items` ADD CONSTRAINT `shop_return_items_return_request_id_fkey` FOREIGN KEY (`return_request_id`) REFERENCES `shop_return_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_return_items` ADD CONSTRAINT `shop_return_items_order_item_id_fkey` FOREIGN KEY (`order_item_id`) REFERENCES `shop_order_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_refunds` ADD CONSTRAINT `shop_refunds_return_request_id_fkey` FOREIGN KEY (`return_request_id`) REFERENCES `shop_return_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_refunds` ADD CONSTRAINT `shop_refunds_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `shop_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_inventory_stocks` ADD CONSTRAINT `shop_inventory_stocks_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_inventory_stocks` ADD CONSTRAINT `shop_inventory_stocks_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `shop_stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_inventory_movements` ADD CONSTRAINT `shop_inventory_movements_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_inventory_movements` ADD CONSTRAINT `shop_inventory_movements_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `shop_stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_inventory_movements` ADD CONSTRAINT `shop_inventory_movements_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `shop_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_stock_alerts` ADD CONSTRAINT `shop_stock_alerts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_stock_alerts` ADD CONSTRAINT `shop_stock_alerts_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `shop_stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_carts` ADD CONSTRAINT `shop_carts_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_cart_items` ADD CONSTRAINT `shop_cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `shop_carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_cart_items` ADD CONSTRAINT `shop_cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_wishlists` ADD CONSTRAINT `shop_wishlists_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_wishlist_items` ADD CONSTRAINT `shop_wishlist_items_wishlist_id_fkey` FOREIGN KEY (`wishlist_id`) REFERENCES `shop_wishlists`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_wishlist_items` ADD CONSTRAINT `shop_wishlist_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_notifications` ADD CONSTRAINT `shop_notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `shop_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_email_logs` ADD CONSTRAINT `shop_email_logs_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_email_logs` ADD CONSTRAINT `shop_email_logs_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `shop_email_templates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_product_price_history` ADD CONSTRAINT `shop_product_price_history_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_product_price_history` ADD CONSTRAINT `shop_product_price_history_changed_by_fkey` FOREIGN KEY (`changed_by`) REFERENCES `shop_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_bulk_pricing` ADD CONSTRAINT `shop_bulk_pricing_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_order_analytics` ADD CONSTRAINT `shop_order_analytics_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `shop_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_product_analytics` ADD CONSTRAINT `shop_product_analytics_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_customer_analytics` ADD CONSTRAINT `shop_customer_analytics_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_audit_logs` ADD CONSTRAINT `shop_audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `shop_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_system_settings` ADD CONSTRAINT `shop_system_settings_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `shop_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_supplier_products` ADD CONSTRAINT `shop_supplier_products_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `shop_suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_supplier_products` ADD CONSTRAINT `shop_supplier_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_supplier_performance` ADD CONSTRAINT `shop_supplier_performance_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `shop_suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_supplier_payments` ADD CONSTRAINT `shop_supplier_payments_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `shop_suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_warehouse_zones` ADD CONSTRAINT `shop_warehouse_zones_warehouse_id_fkey` FOREIGN KEY (`warehouse_id`) REFERENCES `shop_warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_warehouse_racks` ADD CONSTRAINT `shop_warehouse_racks_zone_id_fkey` FOREIGN KEY (`zone_id`) REFERENCES `shop_warehouse_zones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_warehouse_locations` ADD CONSTRAINT `shop_warehouse_locations_rack_id_fkey` FOREIGN KEY (`rack_id`) REFERENCES `shop_warehouse_racks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_warehouse_locations` ADD CONSTRAINT `shop_warehouse_locations_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_warehouse_transfers` ADD CONSTRAINT `shop_warehouse_transfers_from_warehouse_id_fkey` FOREIGN KEY (`from_warehouse_id`) REFERENCES `shop_warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_warehouse_transfers` ADD CONSTRAINT `shop_warehouse_transfers_to_warehouse_id_fkey` FOREIGN KEY (`to_warehouse_id`) REFERENCES `shop_warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_warehouse_transfers` ADD CONSTRAINT `shop_warehouse_transfers_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_product_reviews` ADD CONSTRAINT `shop_product_reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_product_reviews` ADD CONSTRAINT `shop_product_reviews_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_review_images` ADD CONSTRAINT `shop_review_images_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `shop_product_reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_review_responses` ADD CONSTRAINT `shop_review_responses_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `shop_product_reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_review_responses` ADD CONSTRAINT `shop_review_responses_responder_id_fkey` FOREIGN KEY (`responder_id`) REFERENCES `shop_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_product_rating_summary` ADD CONSTRAINT `shop_product_rating_summary_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `shop_products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_customer_segment_assignments` ADD CONSTRAINT `shop_customer_segment_assignments_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_customer_segment_assignments` ADD CONSTRAINT `shop_customer_segment_assignments_segment_id_fkey` FOREIGN KEY (`segment_id`) REFERENCES `shop_customer_segments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_loyalty_tiers` ADD CONSTRAINT `shop_loyalty_tiers_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `shop_loyalty_programs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_customer_loyalty_accounts` ADD CONSTRAINT `shop_customer_loyalty_accounts_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_customer_loyalty_accounts` ADD CONSTRAINT `shop_customer_loyalty_accounts_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `shop_loyalty_programs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_customer_loyalty_accounts` ADD CONSTRAINT `shop_customer_loyalty_accounts_current_tier_id_fkey` FOREIGN KEY (`current_tier_id`) REFERENCES `shop_loyalty_tiers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_loyalty_transactions` ADD CONSTRAINT `shop_loyalty_transactions_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_loyalty_transactions` ADD CONSTRAINT `shop_loyalty_transactions_program_id_fkey` FOREIGN KEY (`program_id`) REFERENCES `shop_loyalty_programs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_campaigns` ADD CONSTRAINT `shop_campaigns_target_segment_id_fkey` FOREIGN KEY (`target_segment_id`) REFERENCES `shop_customer_segments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_campaign_emails` ADD CONSTRAINT `shop_campaign_emails_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `shop_campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_campaign_emails` ADD CONSTRAINT `shop_campaign_emails_email_template_id_fkey` FOREIGN KEY (`email_template_id`) REFERENCES `shop_email_templates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_coupons` ADD CONSTRAINT `shop_coupons_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `shop_campaigns`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_coupon_redemptions` ADD CONSTRAINT `shop_coupon_redemptions_coupon_id_fkey` FOREIGN KEY (`coupon_id`) REFERENCES `shop_coupons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_coupon_redemptions` ADD CONSTRAINT `shop_coupon_redemptions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `shop_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_coupon_redemptions` ADD CONSTRAINT `shop_coupon_redemptions_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `shop_customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_campaign_performance` ADD CONSTRAINT `shop_campaign_performance_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `shop_campaigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_transactions` ADD CONSTRAINT `shop_transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `shop_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_transactions` ADD CONSTRAINT `shop_transactions_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `shop_payment_methods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_payment_reconciliation` ADD CONSTRAINT `shop_payment_reconciliation_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `shop_payment_methods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_payment_reconciliation` ADD CONSTRAINT `shop_payment_reconciliation_reconciled_by_fkey` FOREIGN KEY (`reconciled_by`) REFERENCES `shop_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_transaction_disputes` ADD CONSTRAINT `shop_transaction_disputes_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `shop_transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
