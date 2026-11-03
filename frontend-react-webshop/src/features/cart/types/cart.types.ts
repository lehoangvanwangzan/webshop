export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  image_url: string | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  /** Giá bán hiện tại (đã tính giảm giá) */
  unit_price: number;
  line_total: number;
  /** false khi sản phẩm ngừng bán hoặc tồn kho < số lượng trong giỏ — không tính vào tổng */
  is_available: boolean;
  product: CartProduct;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_amount: number;
}

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
}
