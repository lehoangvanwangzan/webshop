import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { Cart, AddCartItemPayload } from '../types/cart.types';

/** Mọi API giỏ hàng đều trả về toàn bộ giỏ sau khi thay đổi */
export const cartApi = {
  get: async () => {
    const { data } = await apiClient.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },
  addItem: async (payload: AddCartItemPayload) => {
    const { data } = await apiClient.post<ApiResponse<Cart>>('/cart/items', payload);
    return data.data;
  },
  updateItem: async (itemId: number, quantity: number) => {
    const { data } = await apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity });
    return data.data;
  },
  removeItem: async (itemId: number) => {
    const { data } = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return data.data;
  },
  clear: async () => {
    const { data } = await apiClient.delete<ApiResponse<Cart>>('/cart');
    return data.data;
  },
};
