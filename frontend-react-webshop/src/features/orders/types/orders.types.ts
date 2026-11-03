import type { Cart } from '@features/cart/types/cart.types';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  ward?: string;
  district?: string;
  city: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string | null;
  image_url: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  status_label: string;
  /** Khách còn tự huỷ được không */
  can_cancel: boolean;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: ShippingAddress | null;
  notes: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  payment: { method_code: string | null; method_name: string | null; status: PaymentStatus } | null;
  items: OrderItem[];
}

/** Đơn hàng trả về cho admin — có thêm thông tin khách và các trạng thái được phép chuyển */
export interface AdminOrder extends Order {
  customer: { id: number; user_id: number; full_name: string; email: string; phone: string | null } | null;
  allowed_transitions: OrderStatus[];
}

export interface CheckoutPreview {
  cart: Cart;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  free_shipping_threshold: number;
  address: Omit<ShippingAddress, 'ward' | 'district'> & { ward: string; district: string };
  payment_methods: { code: string; name: string }[];
}

export interface CreateOrderPayload extends ShippingAddress {
  notes?: string;
  payment_method: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export interface OrderStats {
  total: number;
  by_status: Record<OrderStatus, number>;
}
