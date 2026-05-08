import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import type {
  ProductQueryParams,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types/products.types';

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.findAll(params),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      productsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useProductImages(productId: number | undefined) {
  return useQuery({
    queryKey: ['product-images', productId],
    queryFn: () => productsApi.getImages(productId!),
    enabled: !!productId,
  });
}

export function useUploadProductImages(productId: number | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => productsApi.uploadImages(productId!, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-images', productId] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProductImage(productId: number | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: number) => productsApi.deleteImage(productId!, imageId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-images', productId] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
