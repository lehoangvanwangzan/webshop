import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/categories.types';

export const categoriesApi = {
  findAllTree: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },
  findAllFlat: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories/flat');
    return data.data;
  },
  findOne: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
    return data.data;
  },
  create: async (payload: CreateCategoryPayload) => {
    const { data } = await apiClient.post<ApiResponse<Category>>('/categories', payload);
    return data.data;
  },
  update: async (id: number, payload: UpdateCategoryPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
    return data.data;
  },
  remove: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/categories/${id}`);
    return data.data;
  },
};
