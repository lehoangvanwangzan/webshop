import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from '../types/brands.types';

export const brandsApi = {
  findAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Brand[]>>('/brands');
    return data.data;
  },
  findOne: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Brand>>(`/brands/${slug}`);
    return data.data;
  },
  create: async (payload: CreateBrandPayload) => {
    const { data } = await apiClient.post<ApiResponse<Brand>>('/brands', payload);
    return data.data;
  },
  update: async (id: number, payload: UpdateBrandPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Brand>>(`/brands/${id}`, payload);
    return data.data;
  },
  remove: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/brands/${id}`);
    return data.data;
  },
};
