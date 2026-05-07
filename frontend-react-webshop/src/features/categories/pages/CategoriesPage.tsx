import { Link } from 'react-router';
import { Breadcrumb, Spin, Empty } from 'antd';
import {
  HomeOutlined,
  WifiOutlined,
  ApiOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  HddOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { ROUTES } from '@routes/routes';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types/categories.types';

const RED = '#dc2626';

const SLUG_ICON: Record<string, ReactNode> = {
  'bo-phat-wifi': <WifiOutlined />,
  'thiet-bi-can-bang-tai': <ApiOutlined />,
  'bo-chuyen-mach-switch': <ApartmentOutlined />,
  'thiet-bi-tuong-lua-firewall': <SafetyOutlined />,
  'thiet-bi-luu-tru': <DatabaseOutlined />,
  'o-cung-cho-server-nas': <HddOutlined />,
  'may-chu-server': <CloudServerOutlined />,
  'thiet-bi-mang-cong-nghiep': <ClusterOutlined />,
  'thiet-bi-dien-nhe': <ThunderboltOutlined />,
  'phu-kien-khac': <AppstoreOutlined />,
};

function CategoryCard({ category }: { category: Category }) {
  const icon = SLUG_ICON[category.slug] ?? <AppstoreOutlined />;
  const children = category.children ?? [];

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        (e.currentTarget as HTMLElement).style.borderColor = RED;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ background: RED, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: '#fff', fontSize: 20 }}>{icon}</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, flex: 1, lineHeight: 1.3 }}>
          {category.name}
        </span>
      </div>

      {/* Subcategories list */}
      <div style={{ flex: 1, padding: '8px 0' }}>
        {children.slice(0, 8).map((child) => (
          <Link
            key={child.id}
            to={`${ROUTES.PRODUCTS}?category=${child.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 16px',
              color: '#374151',
              fontSize: 13,
              textDecoration: 'none',
              borderBottom: '1px solid #f9fafb',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#fef2f2';
              (e.currentTarget as HTMLElement).style.color = RED;
              (e.currentTarget as HTMLElement).style.paddingLeft = '20px';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '';
              (e.currentTarget as HTMLElement).style.color = '#374151';
              (e.currentTarget as HTMLElement).style.paddingLeft = '16px';
            }}
          >
            <span>{child.name}</span>
            <RightOutlined style={{ fontSize: 10, color: '#d1d5db' }} />
          </Link>
        ))}

        {children.length > 8 && (
          <Link
            to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
            style={{
              display: 'block',
              padding: '8px 16px',
              color: RED,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            +{children.length - 8} danh mục khác →
          </Link>
        )}
      </div>

      {/* Footer link */}
      <Link
        to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '10px 16px',
          background: '#fef2f2',
          color: RED,
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          borderTop: '1px solid #fee2e2',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#fef2f2'; }}
      >
        Xem tất cả <RightOutlined style={{ fontSize: 10 }} />
      </Link>
    </div>
  );
}

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16, fontSize: 13 }}
        items={[
          { title: <Link to={ROUTES.HOME}><HomeOutlined /> Trang chủ</Link> },
          { title: <span style={{ color: '#6b7280' }}>Danh mục sản phẩm</span> },
        ]}
      />

      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#1f2937' }}>
          DANH MỤC SẢN PHẨM
        </h1>
        <div style={{ flex: 1, height: 2, background: RED, borderRadius: 2 }} />
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải danh mục..." />
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
