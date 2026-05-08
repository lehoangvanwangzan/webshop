import apiClient from '@shared/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.types';
import type {
  Product,
  ProductImage,
  CreateProductPayload,
  UpdateProductPayload,
  ProductQueryParams,
} from '../types/products.types';

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000/api/v1';
const ORIGIN = BASE.replace(/\/api\/v\d+\/?$/, '');

/** Chuyển image_url tương đối → URL tuyệt đối */
export const resolveProductImageUrl = (url: string): string =>
  url.startsWith('http') ? url : `${ORIGIN}${url}`;

export const productsApi = {
  findAll: async (params?: ProductQueryParams) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      '/products',
      { params },
    );
    return data.data;
  },

  findOne: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  },

  create: async (payload: CreateProductPayload) => {
    const { data } = await apiClient.post<ApiResponse<Product>>('/products', payload);
    return data.data;
  },

  update: async (id: number, payload: UpdateProductPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Product>>(
      `/products/${id}`,
      payload,
    );
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      `/products/${id}`,
    );
    return data.data;
  },

  getImages: async (productId: number) => {
    const { data } = await apiClient.get<ApiResponse<ProductImage[]>>(
      `/products/${productId}/images`,
    );
    return data.data;
  },

  uploadImages: async (productId: number, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const { data } = await apiClient.post<ApiResponse<ProductImage[]>>(
      `/products/${productId}/images`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data;
  },

  deleteImage: async (productId: number, imageId: number) => {
    const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      `/products/${productId}/images/${imageId}`,
    );
    return data.data;
  },
};
