import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AppstoreOutlined, DownOutlined } from '@ant-design/icons';
import { ROUTES } from '@routes/routes';
import { COLORS } from '@shared/constants/colors';
import { subCategoryCardHover } from '@shared/utils/hoverHandlers';
import { useCategories } from '../hooks/useCategories';
import { SLUG_ICON } from '../constants/categoryIcons';
import { ImageWithFallback } from './ImageWithFallback';

function getColumnCount(count: number): number {
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  return 4;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export function CategoryFlyout() {
  const { data: categories = [] } = useCategories();
  const isMobile = useIsMobile();
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const activeCat = activeCatId
    ? categories.find((c) => c.id === activeCatId)
    : categories[0];

  // Mobile: accordion dọc
  if (isMobile) {
    return (
      <div style={{
        background: '#fff',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        borderRadius: '0 0 8px 8px',
        borderTop: `3px solid ${COLORS.primary}`,
        width: '100vw',
        maxWidth: 360,
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '4px 0',
      }}>
        {categories.map((cat, idx) => {
          const Icon = SLUG_ICON[cat.slug] ?? AppstoreOutlined;
          const isExpanded = expandedId === cat.id;
          const hasChildren = (cat.children ?? []).length > 0;
          const isLast = idx === categories.length - 1;
          return (
            <div key={cat.id}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 16px', fontSize: 13, cursor: 'pointer',
                  borderBottom: isLast && !isExpanded ? 'none' : '1px solid #f3f4f6',
                  background: isExpanded ? COLORS.primaryLight : '#fff',
                  color: isExpanded ? COLORS.primary : '#374151',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 15, width: 18, textAlign: 'center', color: isExpanded ? COLORS.primary : '#9ca3af' }}>
                  <Icon />
                </span>
                <span style={{ flex: 1, fontWeight: isExpanded ? 600 : 400 }}>{cat.name}</span>
                {hasChildren && (
                  <DownOutlined style={{
                    fontSize: 10, color: '#9ca3af',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                  }} />
                )}
              </div>

              {isExpanded && hasChildren && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 6, padding: '10px 12px 14px',
                  background: '#fafafa',
                  borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                }}>
                  {(cat.children ?? []).map((child) => (
                    <Link
                      key={child.id}
                      to={`${ROUTES.PRODUCTS}?category=${child.slug}`}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 4, padding: '8px 4px', border: '1px solid #f3f4f6',
                        borderRadius: 6, textDecoration: 'none', background: '#fff',
                        transition: 'all 0.15s',
                      }}
                      {...subCategoryCardHover}
                    >
                      <div style={{
                        width: '100%', height: 40, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: '#f9fafb', borderRadius: 4, overflow: 'hidden',
                      }}>
                        <ImageWithFallback src={child.image_url ?? ''} alt={child.name} />
                      </div>
                      <span style={{ fontSize: 10, color: '#374151', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>
                        {child.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop: 2 cột — danh mục cha trái, danh mục con phải
  return (
    <div style={{
      display: 'flex',
      background: '#fff',
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
      borderRadius: '0 0 8px 8px',
      borderTop: `3px solid ${COLORS.primary}`,
      overflow: 'hidden',
      minHeight: 420,
    }}>
      {/* Cột trái — danh mục cha */}
      <div style={{ width: 240, borderRight: '1px solid #f3f4f6', flexShrink: 0 }}>
        {categories.map((cat) => {
          const isActive = activeCat?.id === cat.id;
          const Icon = SLUG_ICON[cat.slug] ?? AppstoreOutlined;
          return (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveCatId(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', fontSize: 13, cursor: 'pointer',
                borderBottom: '1px solid #f3f4f6',
                background: isActive ? COLORS.primaryLight : '#fff',
                color: isActive ? COLORS.primary : '#374151',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 15, width: 18, textAlign: 'center', color: isActive ? COLORS.primary : '#9ca3af' }}>
                <Icon />
              </span>
              <span style={{ flex: 1, fontWeight: isActive ? 600 : 400 }}>{cat.name}</span>
              <span style={{ fontSize: 10, color: '#d1d5db' }}>›</span>
            </div>
          );
        })}
      </div>

      {/* Cột phải — danh mục con dạng card */}
      <div style={{ flex: 1, padding: '14px 16px', minWidth: 340, overflowY: 'auto' }}>
        {activeCat && (
          <>
            <div style={{
              fontSize: 12, fontWeight: 700, color: COLORS.primary,
              textTransform: 'uppercase', marginBottom: 12,
              paddingBottom: 8, borderBottom: `2px solid ${COLORS.primary}`,
            }}>
              {activeCat.name}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${getColumnCount((activeCat.children ?? []).length)}, 1fr)`,
              gap: 8,
            }}>
              {(activeCat.children ?? []).map((child) => (
                <Link
                  key={child.id}
                  to={`${ROUTES.PRODUCTS}?category=${child.slug}`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 6, padding: '10px 6px', border: '1px solid #f3f4f6',
                    borderRadius: 6, textDecoration: 'none', background: '#fff',
                    transition: 'all 0.15s', cursor: 'pointer',
                  }}
                  {...subCategoryCardHover}
                >
                  <div style={{
                    width: '100%', height: 52, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#f9fafb', borderRadius: 4, overflow: 'hidden',
                  }}>
                    <ImageWithFallback src={child.image_url ?? ''} alt={child.name} />
                  </div>
                  <span style={{ fontSize: 11, color: '#374151', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>
                    {child.name}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
