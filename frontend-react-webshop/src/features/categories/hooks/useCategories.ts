import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';

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
