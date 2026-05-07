import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '../api/brands.api';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.findAll(),
  });
}
