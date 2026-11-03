import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Empty, Pagination, Spin, Tabs, Tag } from 'antd';
import { useMyOrders } from '../hooks/useOrders';
import type { OrderStatus } from '../types/orders.types';
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, formatDateTime, formatPrice } from '../constants/orderStatus';
import { resolveProductImageUrl } from '@features/products/api/products.api';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

const TABS: Array<{ key: OrderStatus | 'all'; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: ORDER_STATUS_LABEL.pending },
  { key: 'confirmed', label: ORDER_STATUS_LABEL.confirmed },
  { key: 'processing', label: ORDER_STATUS_LABEL.processing },
  { key: 'shipped', label: ORDER_STATUS_LABEL.shipped },
  { key: 'delivered', label: ORDER_STATUS_LABEL.delivered },
  { key: 'cancelled', label: ORDER_STATUS_LABEL.cancelled },
];

const PAGE_SIZE = 10;

export function MyOrdersPage() {
  const [tab, setTab] = useState<OrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useMyOrders({
    page,
    limit: PAGE_SIZE,
    status: tab === 'all' ? undefined : tab,
  });

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Đơn hàng của tôi</h1>

      <div className="bg-white rounded-xl border border-gray-100 px-4">
        <Tabs
          activeKey={tab}
          onChange={(k) => {
            setTab(k as OrderStatus | 'all');
            setPage(1);
          }}
          items={TABS.map((t) => ({ key: t.key, label: t.label }))}
        />
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center">
          <Spin size="large" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-20">
          <Empty description={tab === 'all' ? 'Bạn chưa có đơn hàng nào' : 'Không có đơn hàng nào'}>
            <Link to={ROUTES.HOME}>
              <Button type="primary" style={{ background: COLORS.primary }}>Mua sắm ngay</Button>
            </Link>
          </Empty>
        </div>
      ) : (
        <Spin spinning={isFetching && !isLoading}>
          <div className="space-y-4 mt-4">
            {data.items.map((order) => {
              const first = order.items[0];
              const detailUrl = ROUTES.ORDER_DETAIL.replace(':id', String(order.id));
              return (
                <Link
                  key={order.id}
                  to={detailUrl}
                  className="block bg-white rounded-xl border border-gray-100 hover:border-red-200 transition-colors"
                >
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-50">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-800">{order.order_number}</span>
                      <span className="text-gray-400 ml-2 hidden sm:inline">{formatDateTime(order.created_at)}</span>
                    </div>
                    <Tag color={ORDER_STATUS_COLOR[order.status]} className="m-0">{order.status_label}</Tag>
                  </div>
                  <div className="flex items-center gap-4 px-4 sm:px-5 py-4">
                    <img
                      src={first?.image_url ? resolveProductImageUrl(first.image_url) : '/placeholder.png'}
                      alt={first?.product_name}
                      className="w-16 h-16 object-contain rounded-lg border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 line-clamp-1">{first?.product_name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        x{first?.quantity}
                        {order.items.length > 1 && ` · và ${order.items.length - 1} sản phẩm khác`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">Tổng tiền</p>
                      <p className="font-bold" style={{ color: COLORS.primary }}>{formatPrice(order.total_amount)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination current={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} showSizeChanger={false} />
            </div>
          )}
        </Spin>
      )}
    </div>
  );
}
