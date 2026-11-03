import { Product } from '../entities/product.entity';

/** Giá bán thực tế: dùng discount_price nếu hợp lệ và thấp hơn giá gốc */
export const effectivePrice = (p: Product): number => {
  const price = Number(p.price);
  const discount = p.discount_price != null ? Number(p.discount_price) : null;
  return discount != null && discount > 0 && discount < price ? discount : price;
};
