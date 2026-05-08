import { Link } from 'react-router';
import { AppstoreOutlined, RightOutlined } from '@ant-design/icons';
import { ROUTES } from '@routes/routes';
import { COLORS } from '@shared/constants/colors';
import { categoryCardHover, categoryRowHover, categoryFooterHover } from '@shared/utils/hoverHandlers';
import { SLUG_ICON } from '../constants/categoryIcons';
import type { Category } from '../types/categories.types';

export function CategoryCard({ category }: { category: Category }) {
  const Icon = SLUG_ICON[category.slug] ?? AppstoreOutlined;
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
      {...categoryCardHover}
    >
      <div style={{ background: COLORS.primary, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: '#fff', fontSize: 20 }}><Icon /></span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, flex: 1, lineHeight: 1.3 }}>
          {category.name}
        </span>
      </div>

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
            {...categoryRowHover}
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
              color: COLORS.primary,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            +{children.length - 8} danh mục khác →
          </Link>
        )}
      </div>

      <Link
        to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '10px 16px',
          background: COLORS.primaryLight,
          color: COLORS.primary,
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          borderTop: `1px solid ${COLORS.primaryBorder}`,
          transition: 'background 0.15s',
        }}
        {...categoryFooterHover}
      >
        Xem tất cả <RightOutlined style={{ fontSize: 10 }} />
      </Link>
    </div>
  );
}
