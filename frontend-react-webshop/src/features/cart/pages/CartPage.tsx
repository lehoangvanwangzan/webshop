import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Empty, InputNumber, Popconfirm, Spin, Tag } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../hooks/useCart';
import type { CartItem } from '../types/cart.types';
import { resolveProductImageUrl } from '@features/products/api/products.api';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const productUrl = (id: number) => ROUTES.PRODUCT_DETAIL.replace(':id', String(id));

function CartItemRow({ item }: { item: CartItem }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const { product } = item;
  const hasDiscount = item.unit_price < product.price;
  const maxQty = Math.max(1, product.stock);

  // Gõ số chỉ đổi giá trị tạm; gửi lên server khi rời ô / Enter / bấm nút +-
  const [draftQty, setDraftQty] = useState<number | null>(item.quantity);
  useEffect(() => setDraftQty(item.quantity), [item.quantity]);
  const commitQty = (value: number | null) => {
    const qty = Math.min(Math.max(1, Math.floor(value ?? item.quantity)), maxQty);
    setDraftQty(qty);
    if (qty !== item.quantity) updateItem.mutate({ itemId: item.id, quantity: qty });
  };

  let unavailableReason: string | null = null;
  if (!product.is_active) unavailableReason = 'Sản phẩm đã ngừng bán';
  else if (product.stock <= 0) unavailableReason = 'Sản phẩm đã hết hàng';
  else if (product.stock < item.quantity) unavailableReason = `Chỉ còn ${product.stock} sản phẩm, vui lòng giảm số lượng`;

  return (
    <div className={`flex gap-4 py-4 border-b border-gray-100 last:border-b-0 ${item.is_available ? '' : 'opacity-70'}`}>
      <Link to={productUrl(product.id)} className="shrink-0">
        <img
          src={product.image_url ? resolveProductImageUrl(product.image_url) : '/placeholder.png'}
          alt={product.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg border border-gray-100 bg-white"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <Link to={productUrl(product.id)} className="font-medium text-gray-800 hover:text-red-600 line-clamp-2">
            {product.name}
          </Link>
          <div className="text-xs text-gray-400 mt-1">SKU: {product.sku}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold" style={{ color: COLORS.primary }}>{formatPrice(item.unit_price)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          {unavailableReason && <Tag color="error" className="mt-2">{unavailableReason}</Tag>}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* Không dùng min/max của antd: nó tự kẹp giá trị sau onBlur nên lệch với giỏ — tự kẹp trong commitQty */}
          <InputNumber
            precision={0}
            value={draftQty}
            disabled={!product.is_active || product.stock <= 0 || updateItem.isPending}
            onChange={setDraftQty}
            onBlur={(e) => commitQty(Number(e.target.value) || null)}
            onPressEnter={(e) => commitQty(Number((e.target as HTMLInputElement).value) || null)}
            onStep={(value) => commitQty(value)}
            style={{ width: 90 }}
          />
          <div className="w-28 text-right font-semibold text-gray-800">{formatPrice(item.line_total)}</div>
          <Popconfirm
            title="Xoá sản phẩm khỏi giỏ hàng?"
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => removeItem.mutate(item.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} loading={removeItem.isPending} />
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}

export function CartPage() {
  const { data: cart, isLoading, isError, refetch } = useCart();
  const clearCart = useClearCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500 mb-4">Không tải được giỏ hàng.</p>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    );
  }

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

  const hasUnavailable = cart.items.some((i) => !i.is_available);

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Giỏ hàng <span className="text-gray-400 font-normal text-base">({cart.total_items} sản phẩm)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-100 px-4 sm:px-6">
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          <div className="flex items-center justify-between py-4">
            <Link to={ROUTES.HOME} className="text-sm text-gray-600 hover:text-red-600">
              <ArrowLeftOutlined /> Tiếp tục mua sắm
            </Link>
            <Popconfirm
              title="Xoá toàn bộ giỏ hàng?"
              okText="Xoá hết"
              cancelText="Huỷ"
              onConfirm={() => clearCart.mutate()}
            >
              <Button type="link" danger loading={clearCart.isPending}>Xoá tất cả</Button>
            </Popconfirm>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 lg:sticky lg:top-40">
            <h2 className="font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tạm tính ({cart.total_items} sản phẩm)</span>
              <span>{formatPrice(cart.total_amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Phí vận chuyển</span>
              <span>Tính khi đặt hàng</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-gray-100 pt-4 mb-5">
              <span className="font-semibold text-gray-800">Tổng cộng</span>
              <span className="text-xl font-bold" style={{ color: COLORS.primary }}>
                {formatPrice(cart.total_amount)}
              </span>
            </div>

            {hasUnavailable && (
              <p className="text-xs text-red-500 mb-3">
                Một số sản phẩm không còn đủ hàng — vui lòng giảm số lượng hoặc xoá trước khi đặt hàng.
              </p>
            )}

            <Button
              type="primary"
              size="large"
              block
              disabled={cart.total_items === 0 || hasUnavailable}
              style={{ background: cart.total_items === 0 || hasUnavailable ? undefined : COLORS.primary, fontWeight: 600 }}
              onClick={() => navigate(ROUTES.CHECKOUT)}
            >
              TIẾN HÀNH ĐẶT HÀNG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
