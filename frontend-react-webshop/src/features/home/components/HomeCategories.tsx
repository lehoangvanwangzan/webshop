import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { AppstoreOutlined, RightOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { SLUG_ICON } from '@/features/categories/constants/categoryIcons';
import { ImageWithFallback } from '@/features/categories/components/ImageWithFallback';
import type { Category, ChildCategory } from '@/features/categories/types/categories.types';
import { ROUTES } from '@routes/routes';
import { COLORS } from '@shared/constants/colors';

const RED = COLORS.primary;

function getColumnCount(n: number) {
  if (n <= 4) return 2;
  if (n <= 9) return 3;
  return 4;
}

export function HomeCategories() {
  const { data: categories, isLoading } = useCategories();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeId = selectedId ?? hoveredId;
  const activeCat = activeId ? (categories ?? []).find((c) => c.id === activeId) : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleParentClick = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => { if (!selectedId) setHoveredId(null); }}
      style={{ position: 'relative', flexShrink: 0 }}
    >
      {/* Cột trái — danh mục cha */}
      <ul style={{
        listStyle: 'none', margin: 0, padding: 0, width: 260,
        background: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        borderTop: `3px solid ${RED}`,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: '8px 16px' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} active paragraph={false} style={{ marginBottom: 10 }} />
            ))}
          </div>
        ) : (
          (categories ?? []).filter((c: Category) => c.is_active).map((cat: Category, idx, arr) => {
            const Icon = SLUG_ICON[cat.slug] ?? AppstoreOutlined;
            const isActive = cat.id === activeId;
            const isSelected = cat.id === selectedId;
            const isLast = idx === arr.length - 1;
            return (
              <li key={cat.id}>
                <div
                  onMouseEnter={() => setHoveredId(cat.id)}
                  onClick={() => handleParentClick(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    paddingLeft: isActive ? 20 : 16,
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    color: isActive ? RED : '#374151',
                    background: isActive ? '#fef2f2' : 'transparent',
                    borderBottom: isLast ? 'none' : '1px solid #f5f5f5',
                    borderLeft: isSelected ? `3px solid ${RED}` : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 15, width: 18, textAlign: 'center', color: isActive ? RED : '#9ca3af' }}>
                      <Icon />
                    </span>
                    {cat.name}
                  </span>
                  <RightOutlined style={{ fontSize: 10, opacity: 0.35 }} />
                </div>
              </li>
            );
          })
        )}
      </ul>

      {/* Panel con — overlay sang phải */}
      {activeCat && (activeCat.children ?? []).length > 0 && (
        <div
          onMouseEnter={() => setHoveredId(activeCat.id)}
          style={{
            position: 'absolute',
            left: 268,
            top: 0,
            zIndex: 50,
            background: '#fff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            borderTop: `3px solid ${RED}`,
            borderRadius: 8,
            padding: '16px 20px',
            minWidth: 380,
            maxWidth: 560,
          }}
        >
          <div style={{
            fontSize: 12, fontWeight: 700, color: RED,
            textTransform: 'uppercase', marginBottom: 12,
            paddingBottom: 8, borderBottom: `2px solid ${RED}`,
          }}>
            {activeCat.name}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getColumnCount((activeCat.children ?? []).length)}, 1fr)`,
            gap: 8,
          }}>
            {(activeCat.children ?? []).map((child: ChildCategory) => (
              <Link
                key={child.id}
                to={`${ROUTES.PRODUCTS}?category=${child.slug}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 6, padding: '10px 8px', border: '1px solid #f3f4f6',
                  borderRadius: 6, textDecoration: 'none', background: '#fff', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.background = '#fef2f2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{
                  width: '100%', height: 52,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
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
        </div>
      )}
    </div>
  );
}
