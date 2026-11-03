/**
 * Giá hiển thị của sản phẩm — cùng quy tắc với backend (products/utils/product-price.ts):
 * dùng discount_price nếu > 0 và thấp hơn giá gốc.
 * Nhận cả string để an toàn với dữ liệu DECIMAL chưa được ép kiểu.
 */
export function getPriceInfo(p: { price: number | string; discount_price?: number | string | null }) {
  const price = Number(p.price) || 0;
  const discount = p.discount_price != null ? Number(p.discount_price) : null;
  const hasDiscount = discount != null && discount > 0 && discount < price;
  return {
    finalPrice: hasDiscount ? discount : price,
    originalPrice: hasDiscount ? price : null,
    // Làm tròn xuống để không phóng đại mức giảm (99.99% → 99%, không hiện "-100%"); tối thiểu 1%
    discountPercent: hasDiscount ? Math.max(1, Math.floor((1 - discount / price) * 100)) : 0,
  };
}

/** 1111111 → "1.111.111đ" */
export const formatVnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;
