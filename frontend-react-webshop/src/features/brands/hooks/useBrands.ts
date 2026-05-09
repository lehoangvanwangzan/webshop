import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsApi } from '../api/brands.api';
import type { CreateBrandPayload, UpdateBrandPayload } from '../types/brands.types';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.findAll(),
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBrandPayload) => brandsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBrandPayload }) =>
      brandsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => brandsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
}
