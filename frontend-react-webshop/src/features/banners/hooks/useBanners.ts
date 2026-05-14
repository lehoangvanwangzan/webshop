import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannersApi } from '../api/banners.api';
import type {
  BannerQueryParams,
  CreateBannerPayload,
  UpdateBannerPayload,
} from '../types/banners.types';

/**
 * Hook để lấy danh sách banners với phân trang và lọc
 * @param params - Query parameters (page, limit, position, is_active, search)
 * @returns React Query result
 */
export function useBanners(params?: BannerQueryParams) {
  return useQuery({
    queryKey: ['banners', params],
    queryFn: () => bannersApi.findAll(params),
  });
}

/**
 * Hook để lấy chi tiết một banner
 * @param id - ID banner
 * @returns React Query result
 */
export function useBanner(id: number) {
  return useQuery({
    queryKey: ['banners', id],
    queryFn: () => bannersApi.findOne(id),
    enabled: !!id,
  });
}

/**
 * Hook để tạo mới banner
 * @returns Mutation object
 */
export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBannerPayload) => bannersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });
}

/**
 * Hook để cập nhật banner
 * @returns Mutation object
 */
export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBannerPayload }) =>
      bannersApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });
}

/**
 * Hook để xoá banner
 * @returns Mutation object
 */
export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bannersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });
}

/**
 * Hook để upload ảnh banner
 * @param bannerId - ID banner
 * @returns Mutation object
 */
export function useUploadBannerImage(bannerId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bannersApi.uploadImage(bannerId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners', bannerId] });
      qc.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}
