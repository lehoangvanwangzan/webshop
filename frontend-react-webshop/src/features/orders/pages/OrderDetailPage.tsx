import { Link, useParams } from 'react-router';
import { App, Button, Popconfirm, Spin, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useCancelMyOrder, useMyOrder } from '../hooks/useOrders';
import { OrderStatusSteps } from '../components/OrderStatusSteps';
import { ORDER_STATUS_COLOR, formatAddress, formatDateTime, formatPrice } from '../constants/orderStatus';
import { getApiErrorMessage } from '@features/cart/hooks/useCart';
import { resolveProductImageUrl } from '@features/products/api/products.api';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Chưa thanh toán',
  processing: 'Đang xử lý',
  success: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  cancelled: 'Đã huỷ',
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading, isError } = useMyOrder(orderId);
  const cancelOrder = useCancelMyOrder();
  const { message } = App.useApp();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500 mb-4">Không tìm thấy đơn hàng.</p>
        <Link to={ROUTES.ORDERS}><Button>Về danh sách đơn hàng</Button></Link>
      </div>
    );
  }

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(order.id);
      message.success('Đã huỷ đơn hàng');
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Huỷ đơn thất bại'));
    }
  };

  const addr = order.shipping_address;

  return (
    <div className="py-6 space-y-4">
      <Link to={ROUTES.ORDERS} className="text-sm text-gray-600 hover:text-red-600">
        <ArrowLeftOutlined /> Đơn hàng của tôi
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Đơn hàng {order.order_number}
          </h1>
          <p className="text-sm text-gray-400">Đặt lúc {formatDateTime(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Tag color={ORDER_STATUS_COLOR[order.status]} className="text-sm px-3 py-1 m-0">{order.status_label}</Tag>
          {order.can_cancel && (
            <Popconfirm
              title="Huỷ đơn hàng này?"
              description="Thao tác không thể hoàn tác."
              okText="Huỷ đơn"
              okButtonProps={{ danger: true }}
              cancelText="Không"
              onConfirm={handleCancel}
            >
              <Button danger loading={cancelOrder.isPending}>Huỷ đơn</Button>
            </Popconfirm>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 overflow-x-auto">
        <OrderStatusSteps status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm">
          <h2 className="font-semibold text-gray-800 mb-3">Địa chỉ nhận hàng</h2>
          <p className="font-medium text-gray-800">{addr?.full_name}</p>
          <p className="text-gray-600 mt-1">{addr?.phone}</p>
          <p className="text-gray-600 mt-1">{formatAddress(addr)}</p>
          {order.notes && <p className="text-gray-500 mt-3 italic">Ghi chú: {order.notes}</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm">
          <h2 className="font-semibold text-gray-800 mb-3">Thanh toán</h2>
          <p className="text-gray-700">{order.payment?.method_name ?? '—'}</p>
          {order.payment && (
            <p className="mt-1">
              <Tag color={order.payment.status === 'success' ? 'green' : order.payment.status === 'cancelled' ? 'default' : 'orange'}>
                {PAYMENT_STATUS_LABEL[order.payment.status] ?? order.payment.status}
              </Tag>
            </p>
          )}
          {order.paid_at && <p className="text-gray-400 mt-1">Thanh toán lúc {formatDateTime(order.paid_at)}</p>}
          {order.cancelled_at && <p className="text-gray-400 mt-1">Huỷ lúc {formatDateTime(order.cancelled_at)}</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 px-5">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-b-0">
            <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', String(item.product_id))} className="shrink-0">
              <img
                src={item.image_url ? resolveProductImageUrl(item.image_url) : '/placeholder.png'}
                alt={item.product_name}
                className="w-16 h-16 object-contain rounded-lg border border-gray-100"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={ROUTES.PRODUCT_DETAIL.replace(':id', String(item.product_id))}
                className="text-sm text-gray-800 hover:text-red-600 line-clamp-2"
              >
                {item.product_name}
              </Link>
              <p className="text-xs text-gray-400 mt-1">
                {formatPrice(item.unit_price)} × {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-800 whitespace-nowrap">{formatPrice(item.subtotal)}</div>
          </div>
        ))}

        <div className="border-t border-gray-100 py-4 space-y-2 text-sm text-gray-600 sm:w-80 sm:ml-auto">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{order.shipping_fee === 0 ? 'Miễn phí' : formatPrice(order.shipping_fee)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
            <span className="font-semibold text-gray-800">Tổng cộng</span>
            <span className="text-lg font-bold" style={{ color: COLORS.primary }}>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
