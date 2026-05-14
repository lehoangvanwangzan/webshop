import apiClient from '@shared/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.types';
import type {
  Banner,
  CreateBannerPayload,
  UpdateBannerPayload,
  BannerQueryParams,
} from '../types/banners.types';

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000/api/v1';
const ORIGIN = BASE.replace(/\/api\/v\d+\/?$/, '');

export const resolveBannerImageUrl = (url: string): string =>
  url.startsWith('http') ? url : `${ORIGIN}${url}`;

export const bannersApi = {
  findAll: async (params?: BannerQueryParams) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Banner>>>(
      '/banners',
      { params },
    );
    return data.data;
  },

  findOne: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Banner>>(`/banners/${id}`);
    return data.data;
  },

  create: async (payload: CreateBannerPayload) => {
    const { data } = await apiClient.post<ApiResponse<Banner>>('/banners', payload);
    return data.data;
  },

  update: async (id: number, payload: UpdateBannerPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Banner>>(
      `/banners/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      `/banners/${id}`,
    );
    return data.data;
  },

  uploadImage: async (id: number, file: File) => {
    const form = new FormData();
    form.append('image', file);
    const { data } = await apiClient.post<ApiResponse<Banner>>(
      `/banners/${id}/image`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data;
  },
};
