import { useCategories } from '@/features/categories/hooks/useCategories';
import { Spin, Alert } from 'antd';
import { FeatureHighlights } from '../components/FeatureHighlights';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { ProductGrid } from '../components/ProductGrid';
// import { HeroSection } from '../components/HeroSection';
import { HomeCategories } from '../components/HomeCategories';

export function HomePage() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Hero section: sidebar + banner */}
      <div className="home-container">
        <div className="home-hero-layout">
          <HomeCategories />
          {/* <HeroSection /> */}
        </div>
      </div>

      <FeatureHighlights />
      <FeaturedProducts />

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" tip="Đang tải danh mục..." />
        </div>
      )}

      {isError && (
        <div style={{ padding: '24px 0' }}>
          <Alert
            message="Lỗi"
            description="Không thể tải danh mục sản phẩm. Vui lòng thử lại sau."
            type="error"
            showIcon
          />
        </div>
      )}

      {!isLoading &&
        !isError &&
        categories?.map((category) => (
          <ProductGrid key={category.id} category={category} />
        ))}
    </div>
  );
}
