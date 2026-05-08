UPDATE shop_products SET is_active = '1' WHERE is_active = 'public';
UPDATE shop_products SET is_active = '2' WHERE is_active = 'draft';
UPDATE shop_products SET is_active = '0' WHERE is_active = 'hidden';
ALTER TABLE shop_products MODIFY COLUMN is_active INT DEFAULT 1;
