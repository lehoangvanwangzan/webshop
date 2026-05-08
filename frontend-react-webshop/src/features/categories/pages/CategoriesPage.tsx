import { Link } from 'react-router';
import { Breadcrumb, Spin, Empty } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { ROUTES } from '@routes/routes';
import { COLORS } from '@shared/constants/colors';
import { useCategories } from '../hooks/useCategories';
import { CategoryCard } from '../components/CategoryCard';

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div style={{ padding: '16px 0' }}>
      <Breadcrumb
        style={{ marginBottom: 16, fontSize: 13 }}
        items={[
          { title: <Link to={ROUTES.HOME}><HomeOutlined /> Trang chủ</Link> },
          { title: <span style={{ color: '#6b7280' }}>Danh mục sản phẩm</span> },
        ]}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#1f2937' }}>
          DANH MỤC SẢN PHẨM
        </h1>
        <div style={{ flex: 1, height: 2, background: COLORS.primary, borderRadius: 2 }} />
      </div>

      {isLoading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div style={{ padding: '80px 0' }}>
          <Empty description="Không thể tải danh mục. Vui lòng thử lại sau." />
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {categories?.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
