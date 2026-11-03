import { OrderStatus } from './entities/order.entity';

/** Miễn phí vận chuyển cho đơn từ 2 triệu (khớp với chính sách hiển thị ở trang sản phẩm) */
export const FREE_SHIPPING_THRESHOLD = 2_000_000;
/** Phí giao hàng tiêu chuẩn cho đơn dưới ngưỡng miễn phí */
export const STANDARD_SHIPPING_FEE = 30_000;

export const calcShippingFee = (subtotal: number) =>
  subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

/** Admin chỉ được chuyển trạng thái theo đúng luồng này */
export const ADMIN_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  refunded: [],
};

/** Khách tự huỷ được khi shop chưa bắt đầu đóng gói */
export const CUSTOMER_CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed'];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị hàng',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
  refunded: 'Đã hoàn tiền',
};
