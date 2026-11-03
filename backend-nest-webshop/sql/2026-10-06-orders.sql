-- Module Đặt hàng — chạy tay vì entity Order để synchronize: false
-- (TypeORM sẽ xoá FK shop_orders_coupon_id_fkey nếu tự đồng bộ bảng này).
-- Các bảng shop_order_details / shop_transactions / shop_payment_methods do TypeORM tự đồng bộ.

-- Tiền: decimal(15,2) cho khớp với shop_products.price (decimal(12,2) giới hạn ~10 tỷ)
ALTER TABLE `shop_orders`
  MODIFY `subtotal` decimal(15,2) NOT NULL,
  MODIFY `total_amount` decimal(15,2) NOT NULL,
  -- Prisma tạo updated_at không có DEFAULT → TypeORM insert sẽ lỗi
  MODIFY `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);
