import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { App } from 'antd';
import { cartApi } from '../api/cart.api';
import type { Cart, AddCartItemPayload } from '../types/cart.types';
import { useAuthStore } from '@features/auth/stores/auth.store';
import { ROUTES } from '@routes/routes';

/** Key theo user để đăng xuất / đổi tài khoản không thấy giỏ của người trước */
const useCartKey = () => {
  const userId = useAuthStore((s) => s.user?.id);
  return ['cart', userId] as const;
};

export const getApiErrorMessage = (err: unknown, fallback = 'Có lỗi xảy ra') => {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return Array.isArray(msg) ? msg[0] : (msg ?? fallback);
};

export function useCart() {
  const token = useAuthStore((s) => s.token);
  const key = useCartKey();
  return useQuery({
    queryKey: key,
    queryFn: () => cartApi.get(),
    enabled: !!token,
  });
}

/** Các mutation đều nhận lại toàn bộ giỏ → ghi thẳng vào cache, không cần refetch */
function useCartMutation<TVars>(mutationFn: (vars: TVars) => Promise<Cart>) {
  const qc = useQueryClient();
  const key = useCartKey();
  const { message } = App.useApp();
  return useMutation({
    mutationFn,
    onSuccess: (cart) => qc.setQueryData(key, cart),
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useUpdateCartItem() {
  return useCartMutation(({ itemId, quantity }: { itemId: number; quantity: number }) =>
    cartApi.updateItem(itemId, quantity),
  );
}

export function useRemoveCartItem() {
  return useCartMutation((itemId: number) => cartApi.removeItem(itemId));
}

export function useClearCart() {
  return useCartMutation((_: void) => cartApi.clear());
}

/**
 * Thêm vào giỏ — nếu chưa đăng nhập thì chuyển sang trang đăng nhập,
 * đăng nhập xong sẽ quay lại đúng trang đang xem.
 */
export function useAddToCart() {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const mutation = useCartMutation((payload: AddCartItemPayload) => cartApi.addItem(payload));

  const addToCart = async (payload: AddCartItemPayload, options?: { goToCart?: boolean }) => {
    if (!token) {
      message.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate(ROUTES.LOGIN, { state: { from: location.pathname } });
      return;
    }
    try {
      await mutation.mutateAsync(payload);
    } catch {
      return; // lỗi đã được báo trong onError
    }
    if (options?.goToCart) {
      navigate(ROUTES.CART);
    } else {
      message.success(`Đã thêm ${payload.quantity} sản phẩm vào giỏ hàng`);
    }
  };

  return { addToCart, isPending: mutation.isPending };
}
