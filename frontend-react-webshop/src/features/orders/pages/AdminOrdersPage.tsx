import { useState } from 'react';
import { App, Button, Drawer, Input, Pagination, Popconfirm, Spin, Tag } from 'antd';
import { PageLayout } from '@shared/components/PageLayout';
import { Clock, ChevronRight, User, MapPin, CreditCard } from 'lucide-react';
import { useAdminOrder, useAdminOrderStats, useAdminOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import type { AdminOrder, OrderStatus } from '../types/orders.types';
import { OrderStatusSteps } from '../components/OrderStatusSteps';
import {
  ORDER_ACTION_LABEL,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  formatAddress,
  formatDateTime,
  formatPrice,
} from '../constants/orderStatus';
import { getApiErrorMessage } from '@features/cart/hooks/useCart';
import { resolveProductImageUrl } from '@features/products/api/products.api';

const STATUS_FILTERS: Array<OrderStatus | 'all'> = [
  'all',
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const PAGE_SIZE = 10;

/* ─── Drawer chi tiết + xử lý đơn ─── */
function OrderDrawer({ orderId, onClose }: { orderId: number | null; onClose: () => void }) {
  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const { message } = App.useApp();

  const changeStatus = async (status: OrderStatus) => {
    if (!order) return;
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      message.success(`Đơn ${order.order_number}: ${ORDER_STATUS_LABEL[status]}`);
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Cập nhật trạng thái thất bại'));
    }
  };

  const nextSteps = order?.allowed_transitions.filter((s) => s !== 'cancelled') ?? [];
  const canCancel = order?.allowed_transitions.includes('cancelled');

  return (
    <Drawer
      open={!!orderId}
      onClose={onClose}
      width={640}
      title={order ? `Đơn hàng ${order.order_number}` : 'Đơn hàng'}
      extra={order && <Tag color={ORDER_STATUS_COLOR[order.status]} className="m-0">{order.status_label}</Tag>}
      footer={
        order && (nextSteps.length > 0 || canCancel) ? (
          <div className="flex justify-between gap-2">
            <div>
              {canCancel && (
                <Popconfirm
                  title="Huỷ đơn hàng này?"
                  description="Tồn kho sẽ được hoàn lại."
                  okText="Huỷ đơn"
                  okButtonProps={{ danger: true }}
                  cancelText="Không"
                  onConfirm={() => changeStatus('cancelled')}
                >
                  <Button danger loading={updateStatus.isPending}>Huỷ đơn</Button>
                </Popconfirm>
              )}
            </div>
            <div className="flex gap-2">
              {nextSteps.map((s) => (
                <Popconfirm
                  key={s}
                  title={`${ORDER_ACTION_LABEL[s]}?`}
                  okText="Xác nhận"
                  cancelText="Không"
                  onConfirm={() => changeStatus(s)}
                >
                  <Button type="primary" loading={updateStatus.isPending}>{ORDER_ACTION_LABEL[s]}</Button>
                </Popconfirm>
              ))}
            </div>
          </div>
        ) : null
      }
    >
      {isLoading || !order ? (
        <div className="py-20 flex justify-center"><Spin /></div>
      ) : (
        <div className="space-y-5">
          <div className="overflow-x-auto">
            <OrderStatusSteps status={order.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <User className="w-3 h-3" /> Khách hàng
              </p>
              <p className="font-semibold text-slate-800">{order.customer?.full_name ?? '—'}</p>
              <p className="text-slate-500 text-xs">{order.customer?.email}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Thanh toán
              </p>
              <p className="font-semibold text-slate-800">{order.payment?.method_name ?? '—'}</p>
              <p className="text-slate-500 text-xs">
                {order.paid_at ? `Đã thanh toán ${formatDateTime(order.paid_at)}` : 'Chưa thanh toán'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl sm:col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Giao đến
              </p>
              <p className="font-semibold text-slate-800">
                {order.shipping_address?.full_name} · {order.shipping_address?.phone}
              </p>
              <p className="text-slate-600">{formatAddress(order.shipping_address)}</p>
              {order.notes && <p className="text-slate-500 italic mt-2">Ghi chú: {order.notes}</p>}
            </div>
          </div>

          <div>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b border-slate-50">
                <img
                  src={item.image_url ? resolveProductImageUrl(item.image_url) : '/placeholder.png'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-contain border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 line-clamp-2">{item.product_name}</p>
                  <p className="text-xs text-slate-400">
                    {item.sku} · {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-800 whitespace-nowrap">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
            <div className="pt-3 space-y-1 text-sm text-slate-600">
              <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{order.shipping_fee === 0 ? 'Miễn phí' : formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-base pt-1">
                <span>Tổng cộng</span><span className="text-blue-600">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Đặt lúc {formatDateTime(order.created_at)}
            {order.cancelled_at && ` · Huỷ lúc ${formatDateTime(order.cancelled_at)}`}
          </p>
        </div>
      )}
    </Drawer>
  );
}

/* ─── Dòng đơn hàng ─── */
function OrderRow({ order, onOpen }: { order: AdminOrder; onOpen: () => void }) {
  const first = order.items[0];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-colors"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={first?.image_url ? resolveProductImageUrl(first.image_url) : '/placeholder.png'}
          alt=""
          className="hidden sm:block w-12 h-12 rounded-xl object-contain border border-slate-100 flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 text-sm">{order.order_number}</span>
            <Tag color={ORDER_STATUS_COLOR[order.status]} className="m-0">{order.status_label}</Tag>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {order.shipping_address?.full_name} · {order.shipping_address?.phone} · {order.items.length} sản phẩm
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 md:gap-8">
        <div className="hidden lg:block text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Thanh toán</p>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">{order.payment?.method_code?.toUpperCase() ?? '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">{formatPrice(order.total_amount)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{formatDateTime(order.created_at)}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </button>
  );
}

/* ─── Main page ─── */
export function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useAdminOrders({
    page,
    limit: PAGE_SIZE,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search || undefined,
  });
  const { data: stats } = useAdminOrderStats();

  return (
    <PageLayout
      title="Đơn hàng"
      subtitle={stats ? `${stats.total} đơn hàng` : undefined}
      action={
        <Input.Search
          allowClear
          placeholder="Mã đơn, tên, SĐT, email..."
          onSearch={(v) => {
            setSearch(v.trim());
            setPage(1);
          }}
          style={{ width: 280 }}
        />
      }
    >
      {/* ── Status filter chips ── */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((value) => (
          <button
            key={value}
            onClick={() => {
              setStatusFilter(value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              statusFilter === value
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {value === 'all' ? 'Tất cả' : ORDER_STATUS_LABEL[value]}
            {value !== 'all' && stats && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                statusFilter === value ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {stats.by_status[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="h-52 flex items-center justify-center"><Spin /></div>
      ) : !data || data.items.length === 0 ? (
        <div className="h-52 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-100">
          <Clock className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm font-medium">Không có đơn hàng nào</p>
        </div>
      ) : (
        <Spin spinning={isFetching && !isLoading}>
          <div className="space-y-3">
            {data.items.map((o) => (
              <OrderRow key={o.id} order={o} onOpen={() => setOpenId(o.id)} />
            ))}
          </div>
        </Spin>
      )}

      {/* ── Pagination ── */}
      {data && data.total > PAGE_SIZE && (
        <div className="flex justify-end">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={data.total}
            onChange={setPage}
            showTotal={(total) => `Tổng ${total} đơn hàng`}
            showSizeChanger={false}
          />
        </div>
      )}

      <OrderDrawer orderId={openId} onClose={() => setOpenId(null)} />
    </PageLayout>
  );
}
