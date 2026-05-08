ALTER TABLE shop_products ADD COLUMN is_active_new INT DEFAULT 1;
UPDATE shop_products SET is_active_new = 1 WHERE CONCAT('', is_active) = 'public';
UPDATE shop_products SET is_active_new = 2 WHERE CONCAT('', is_active) = 'draft';
UPDATE shop_products SET is_active_new = 0 WHERE CONCAT('', is_active) = 'hidden';
UPDATE shop_products SET is_active_new = 1 WHERE CONCAT('', is_active) = '1';
UPDATE shop_products SET is_active_new = 2 WHERE CONCAT('', is_active) = '2';
UPDATE shop_products SET is_active_new = 0 WHERE CONCAT('', is_active) = '0';
ALTER TABLE shop_products DROP COLUMN is_active;
ALTER TABLE shop_products CHANGE COLUMN is_active_new is_active INT DEFAULT 1;
