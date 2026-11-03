import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Alert, App, Button, Empty, Form, Input, Radio, Spin } from 'antd';
import { ArrowLeftOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCheckoutPreview, useCreateOrder } from '../hooks/useOrders';
import type { CreateOrderPayload } from '../types/orders.types';
import { formatPrice } from '../constants/orderStatus';
import { getApiErrorMessage } from '@features/cart/hooks/useCart';
import { resolveProductImageUrl } from '@features/products/api/products.api';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

type FormValues = Omit<CreateOrderPayload, 'payment_method'> & { payment_method: string };

export function CheckoutPage() {
  const { data: preview, isLoading, isError, refetch } = useCheckoutPreview();
  const createOrder = useCreateOrder();
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const { message } = App.useApp();

  // Điền sẵn thông tin người nhận từ hồ sơ / đơn trước
  useEffect(() => {
    if (preview) {
      form.setFieldsValue({
        ...preview.address,
        payment_method: preview.payment_methods[0]?.code,
      });
    }
  }, [preview, form]);

  const onFinish = async (values: FormValues) => {
    try {
      const order = await createOrder.mutateAsync(values);
      message.success(`Đặt hàng thành công! Mã đơn: ${order.order_number}`);
      navigate(ROUTES.ORDER_DETAIL.replace(':id', String(order.id)), { replace: true });
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Đặt hàng thất bại, vui lòng thử lại'));
      refetch(); // tồn kho / giá có thể đã đổi
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !preview) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500 mb-4">Không tải được thông tin đặt hàng.</p>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    );
  }

  const { cart } = preview;
  const unavailable = cart.items.filter((i) => !i.is_available);

  if (cart.items.length === 0) {
    return (
      <div className="py-24">
        <Empty
          image={<ShoppingOutlined style={{ fontSize: 64, color: '#d1d5db' }} />}
          description="Giỏ hàng của bạn đang trống"
        >
          <Link to={ROUTES.HOME}>
            <Button type="primary" style={{ background: COLORS.primary }}>Tiếp tục mua sắm</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const remainingForFreeShip = preview.free_shipping_threshold - preview.subtotal;

  return (
    <div className="py-6">
      <Link to={ROUTES.CART} className="text-sm text-gray-600 hover:text-red-600">
        <ArrowLeftOutlined /> Quay lại giỏ hàng
      </Link>
      <h1 className="text-xl font-bold text-gray-800 mt-2 mb-4">Đặt hàng</h1>

      {unavailable.length > 0 && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          message="Một số sản phẩm trong giỏ không còn đủ hàng"
          description={
            <>
              {unavailable.map((i) => i.product.name).join(', ')}.{' '}
              <Link to={ROUTES.CART}>Cập nhật giỏ hàng</Link> trước khi đặt.
            </>
          }
        />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thông tin giao hàng */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Thông tin người nhận</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Form.Item
                  name="full_name"
                  label="Họ tên"
                  rules={[{ required: true, whitespace: true, min: 2, message: 'Vui lòng nhập họ tên người nhận' }]}
                >
                  <Input placeholder="Nguyễn Văn A" autoComplete="name" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    {
                      validator: (_, v: string) =>
                        !v || /^(0|\+84)\d{9,10}$/.test(v.replace(/[\s.-]/g, ''))
                          ? Promise.resolve()
                          : Promise.reject(new Error('Số điện thoại không hợp lệ')),
                    },
                  ]}
                >
                  <Input placeholder="0901 234 567" autoComplete="tel" />
                </Form.Item>
              </div>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, whitespace: true, min: 5, message: 'Vui lòng nhập số nhà, tên đường' }]}
              >
                <Input placeholder="Số nhà, tên đường" autoComplete="street-address" />
              </Form.Item>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                <Form.Item name="ward" label="Phường / Xã">
                  <Input />
                </Form.Item>
                <Form.Item name="district" label="Quận / Huyện">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="Tỉnh / Thành phố"
                  rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập Tỉnh / Thành phố' }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <Form.Item name="notes" label="Ghi chú" className="mb-0">
                <Input.TextArea rows={3} maxLength={500} showCount placeholder="Thời gian nhận hàng, chỉ dẫn giao hàng..." />
              </Form.Item>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
              <Form.Item
                name="payment_method"
                className="mb-0"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
              >
                <Radio.Group className="w-full">
                  <div className="flex flex-col gap-2">
                    {preview.payment_methods.map((m) => (
                      <Radio key={m.code} value={m.code} className="border border-gray-200 rounded-lg p-3 m-0">
                        {m.name}
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-gray-100 p-5 lg:sticky lg:top-40">
              <h2 className="font-semibold text-gray-800 mb-4">
                Đơn hàng <span className="text-gray-400 font-normal">({cart.total_items} sản phẩm)</span>
              </h2>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className={`flex gap-3 py-3 ${item.is_available ? '' : 'opacity-50'}`}>
                    <div className="relative shrink-0">
                      <img
                        src={item.product.image_url ? resolveProductImageUrl(item.product.image_url) : '/placeholder.png'}
                        alt={item.product.name}
                        className="w-14 h-14 object-contain rounded-lg border border-gray-100"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-sm text-gray-700 line-clamp-2">{item.product.name}</div>
                    <div className="text-sm font-medium text-gray-800 whitespace-nowrap">{formatPrice(item.line_total)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(preview.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{preview.shipping_fee === 0 ? <span className="text-green-600">Miễn phí</span> : formatPrice(preview.shipping_fee)}</span>
                </div>
                {remainingForFreeShip > 0 && (
                  <p className="text-xs text-gray-400">
                    Mua thêm {formatPrice(remainingForFreeShip)} để được miễn phí vận chuyển
                  </p>
                )}
              </div>
              <div className="flex justify-between items-baseline border-t border-gray-100 mt-4 pt-4 mb-5">
                <span className="font-semibold text-gray-800">Tổng cộng</span>
                <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                  {formatPrice(preview.total_amount)}
                </span>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={createOrder.isPending}
                disabled={unavailable.length > 0}
                style={{ background: unavailable.length > 0 ? undefined : COLORS.primary, fontWeight: 600 }}
              >
                ĐẶT HÀNG
              </Button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Bằng việc đặt hàng, bạn đồng ý với điều khoản mua bán của cửa hàng.
              </p>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
