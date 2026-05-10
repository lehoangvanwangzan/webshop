import { Spin } from 'antd';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductCard } from './ProductCard';
import '../styles/ProductGrid.css';

/**
 * Component hiển thị danh mục sản phẩm (Product Grid)
 *
 * Features:
 * - Responsive grid: 1 cột (mobile) / 2 cột (tablet) / 5 cột (desktop)
 * - Section header với tiêu đề và category filters
 * - Hiển thị sản phẩm đang kích hoạt (is_active: 1)
 * - "BÁN CHẠY" badge cho các sản phẩm nổi bật
 * - Shopping cart button trên mỗi card
 * - Loading state và error handling
 * - Pagination support (limit 20 sản phẩm)
 * - Hover animation: translateY(-4px) + shadow
 *
 * @component
 * @example
 * <ProductGrid />
 */
export function ProductGrid() {
  const { data, isLoading, isError } = useProducts({
    is_active: 1,
    limit: 20,
    page: 1,
  });

  return (
    <section className="product-grid-section">
      <div className="product-grid-header">
        <h2 className="product-grid-title">THIẾT BỊ CẦN BẰNG TÀI</h2>
        <div className="product-grid-filters">
          <a href="#" className="product-grid-filter">
            Router Draytek
          </a>
          <a href="#" className="product-grid-filter">
            Router Ubiquiti
          </a>
          <a href="#" className="product-grid-filter">
            Router MikroTik
          </a>
          <a href="#" className="product-grid-filter">
            Router Teltonika
          </a>
        </div>
      </div>

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
