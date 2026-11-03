import type { OrderStatus, ShippingAddress } from '../types/orders.types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị hàng',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
  refunded: 'Đã hoàn tiền',
};

/** Màu antd Tag */
export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'gold',
  confirmed: 'blue',
  processing: 'geekblue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'purple',
};

/** Tên nút hành động admin cho từng trạng thái đích */
export const ORDER_ACTION_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Xác nhận đơn',
  processing: 'Chuẩn bị hàng',
  shipped: 'Giao cho vận chuyển',
  delivered: 'Đã giao thành công',
  cancelled: 'Huỷ đơn',
  refunded: 'Hoàn tiền',
};

/** Các bước hiển thị trên timeline (không gồm huỷ / hoàn tiền) */
export const ORDER_STEPS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const formatAddress = (a: ShippingAddress | null) =>
  a ? [a.address, a.ward, a.district, a.city].filter(Boolean).join(', ') : '—';
