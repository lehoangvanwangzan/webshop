import { Steps } from 'antd';
import type { OrderStatus } from '../types/orders.types';
import { ORDER_STATUS_LABEL, ORDER_STEPS } from '../constants/orderStatus';

/** Timeline trạng thái đơn — đơn huỷ / hoàn tiền hiển thị riêng */
export function OrderStatusSteps({ status }: { status: OrderStatus }) {
  if (status === 'cancelled' || status === 'refunded') {
    return (
      <Steps
        size="small"
        current={1}
        status="error"
        items={[{ title: ORDER_STATUS_LABEL.pending }, { title: ORDER_STATUS_LABEL[status] }]}
      />
    );
  }
  const current = ORDER_STEPS.indexOf(status);
  return (
    <Steps
      size="small"
      responsive
      current={current}
      status={status === 'delivered' ? 'finish' : 'process'}
      items={ORDER_STEPS.map((s) => ({ title: ORDER_STATUS_LABEL[s] }))}
    />
  );
}
