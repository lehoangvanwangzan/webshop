import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../types/categories.types';

const STALE_TIME = 10 * 60 * 1000;

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.findAllTree(),
    staleTime: STALE_TIME,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: () => categoriesApi.findOne(slug),
    enabled: !!slug,
    staleTime: STALE_TIME,
  });
}

export function useCategoriesFlat() {
  return useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => categoriesApi.findAllFlat(),
    staleTime: STALE_TIME,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      categoriesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
    },
  });
}
