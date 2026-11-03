import apiClient from '@shared/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.types';
import type {
  AdminOrder,
  CheckoutPreview,
  CreateOrderPayload,
  Order,
  OrderQueryParams,
  OrderStats,
  OrderStatus,
} from '../types/orders.types';

export const ordersApi = {
  checkoutPreview: async () => {
    const { data } = await apiClient.get<ApiResponse<CheckoutPreview>>('/orders/checkout-preview');
    return data.data;
  },
  create: async (payload: CreateOrderPayload) => {
    const { data } = await apiClient.post<ApiResponse<Order>>('/orders', payload);
    return data.data;
  },
  findMine: async (params?: OrderQueryParams) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params });
    return data.data;
  },
  findMineOne: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },
  cancelMine: async (id: number) => {
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return data.data;
  },
};

export const adminOrdersApi = {
  findAll: async (params?: OrderQueryParams) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AdminOrder>>>('/admin/orders', { params });
    return data.data;
  },
  stats: async () => {
    const { data } = await apiClient.get<ApiResponse<OrderStats>>('/admin/orders/stats');
    return data.data;
  },
  findOne: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<AdminOrder>>(`/admin/orders/${id}`);
    return data.data;
  },
  updateStatus: async (id: number, status: OrderStatus) => {
    const { data } = await apiClient.patch<ApiResponse<AdminOrder>>(`/admin/orders/${id}/status`, { status });
    return data.data;
  },
};
