import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { ordersApi, adminOrdersApi } from '../api/orders.api';
import type { CreateOrderPayload, OrderQueryParams, OrderStatus } from '../types/orders.types';
import { useAuthStore } from '@features/auth/stores/auth.store';

/* ─── Khách hàng ─── */

export function useCheckoutPreview() {
  return useQuery({
    queryKey: ['checkout-preview'],
    queryFn: () => ordersApi.checkoutPreview(),
    // Luôn lấy giá / tồn kho mới nhất khi vào trang checkout
    staleTime: 0,
    gcTime: 0,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] }); // giỏ đã chuyển thành đơn
      qc.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
}

export function useMyOrders(params: OrderQueryParams) {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['my-orders', userId, params],
    queryFn: () => ordersApi.findMine(params),
    placeholderData: keepPreviousData,
  });
}

export function useMyOrder(id: number) {
  return useQuery({
    queryKey: ['my-order', id],
    queryFn: () => ordersApi.findMineOne(id),
    enabled: !!id,
  });
}

export function useCancelMyOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersApi.cancelMine(id),
    onSuccess: (order) => {
      qc.setQueryData(['my-order', order.id], order);
      qc.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
}

/* ─── Admin ─── */

export function useAdminOrders(params: OrderQueryParams) {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => adminOrdersApi.findAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminOrderStats() {
  return useQuery({
    queryKey: ['admin-orders', 'stats'],
    queryFn: () => adminOrdersApi.stats(),
  });
}

export function useAdminOrder(id: number | null) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => adminOrdersApi.findOne(id!),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      adminOrdersApi.updateStatus(id, status),
    onSuccess: (order) => {
      qc.setQueryData(['admin-order', order.id], order);
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}
