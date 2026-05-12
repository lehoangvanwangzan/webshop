import { useState } from 'react';
import { Spin } from 'antd';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductCard } from './ProductCard';
import type { Category } from '@/features/categories/types/categories.types';
import '../styles/ProductGrid.css';

interface ProductGridProps {
  category: Category;
}

/**
 * Component hiển thị danh mục sản phẩm (Product Grid)
 *
 * Features:
 * - Responsive grid: 1 cột (mobile) / 2 cột (tablet) / 5 cột (desktop)
 * - Section header với tiêu đề và category filters từ shop_categories và shop_child_categories
 * - Hiển thị sản phẩm theo category_id
 * - Loading state và error handling
 *
 * @component
 */
export function ProductGrid({ category }: ProductGridProps) {
  // State lưu trữ category_id đang được chọn để lọc (mặc định là category_id của cha)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(category.id);

  // Lấy danh sách sản phẩm theo category_id đã chọn
  const { data, isLoading, isError } = useProducts({
    is_active: 1,
    category_id: selectedCategoryId,
    limit: 20,
    page: 1,
  });

  // Lấy tối đa 4 sub-categories (shop_child_categories) làm bộ lọc nhanh
  const filters = category.children?.slice(0, 4) || [];

  return (
    <section className="product-grid-section">
      <div className="product-grid-header">
        {/* Tiêu đề lấy từ tên danh mục cha (shop_categories) */}
        <h2 className="product-grid-title">{category.name.toUpperCase()}</h2>
        
        {/* Các liên kết bộ lọc lấy từ danh mục con (shop_child_categories) */}
        <div className="product-grid-filters">
          <button
            className={`product-grid-filter ${selectedCategoryId === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            Tất cả
          </button>
          {filters.map((child) => (
            <button
              key={child.id}
              className={`product-grid-filter ${selectedCategoryId === child.id ? 'active' : ''}`}
              onClick={() => setSelectedCategoryId(child.id)}
            >
              {child.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
        </div>
      )}

      {isError && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#ff4d4f' }}>
          Không thể tải sản phẩm cho danh mục {category.name}. Vui lòng thử lại.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="product-grid">
          {(data?.items ?? []).length > 0 ? (
            (data?.items ?? []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '24px', color: '#999' }}>
              Chưa có sản phẩm nào trong danh mục này.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
