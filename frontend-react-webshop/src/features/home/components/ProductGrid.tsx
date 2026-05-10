import { Spin } from 'antd';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductCard } from './ProductCard';
import '../styles/ProductGrid.css';

/**
 * Component hiển thị danh mục sản phẩm (Product Grid)
 *
 * Features:
 * - Responsive grid: 1 cột (mobile) / 2 cột (tablet) / 4 cột (desktop)
 * - Hiển thị sản phẩm đang kích hoạt (is_active: 1)
 * - Hỗ trợ loading state và error handling
 * - Pagination support (limit 12 sản phẩm)
 * - Hover animation: scale(1.05) + box-shadow
 *
 * @component
 * @example
 * <ProductGrid />
 */
export function ProductGrid() {
  const { data, isLoading, isError } = useProducts({
    is_active: 1,
    limit: 12,
    page: 1,
  });

  return (
    <section>
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
        </div>
      )}

      {isError && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#ff4d4f' }}>
          Không thể tải sản phẩm. Vui lòng thử lại.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="product-grid">
          {(data?.items ?? []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
