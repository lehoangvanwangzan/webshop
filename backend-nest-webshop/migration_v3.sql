ALTER TABLE shop_products ADD COLUMN is_active_new INT DEFAULT 1;
UPDATE shop_products SET is_active_new = 1 WHERE is_active = 'public' OR is_active = '1';
UPDATE shop_products SET is_active_new = 2 WHERE is_active = 'draft' OR is_active = '2';
UPDATE shop_products SET is_active_new = 0 WHERE is_active = 'hidden' OR is_active = '0';
ALTER TABLE shop_products DROP COLUMN is_active;
ALTER TABLE shop_products CHANGE COLUMN is_active_new is_active INT DEFAULT 1;
