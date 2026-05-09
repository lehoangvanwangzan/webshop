import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Breadcrumb, Spin, Empty } from 'antd';
import { HomeOutlined, AppstoreOutlined, RightOutlined } from '@ant-design/icons';
import { ROUTES } from '@routes/routes';
import { COLORS } from '@shared/constants/colors';
import { useCategories } from '../hooks/useCategories';
import { SLUG_ICON } from '../constants/categoryIcons';
import { ImageWithFallback } from '../components/ImageWithFallback';
import type { Category, ChildCategory } from '../types/categories.types';

const RED = COLORS.primary;

function getColumnCount(n: number) {
  if (n <= 4) return 2;
  if (n <= 9) return 3;
  return 4;
}

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeList = (categories ?? []).filter((c: Category) => c.is_active);
  const activeId = selectedId ?? hoveredId;
  const activeCat = activeId ? activeList.find((c) => c.id === activeId) : null;

  // Mặc định chọn danh mục đầu tiên khi load xong
  useEffect(() => {
    if (activeList.length > 0 && !selectedId) {
      setSelectedId(activeList[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeList.length]);

  // Click ngoài → clear selected
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
    <div style={{ padding: '16px 0' }}>
      <Breadcrumb
        style={{ marginBottom: 16, fontSize: 13 }}
        items={[
          { title: <Link to={ROUTES.HOME}><HomeOutlined /> Trang chủ</Link> },
          { title: <span style={{ color: '#6b7280' }}>Danh mục sản phẩm</span> },
        ]}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#1f2937' }}>DANH MỤC SẢN PHẨM</h1>
        <div style={{ flex: 1, height: 2, background: RED, borderRadius: 2 }} />
      </div>

      {isLoading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}><Spin size="large" /></div>
      ) : isError ? (
        <div style={{ padding: '80px 0' }}>
          <Empty description="Không thể tải danh mục. Vui lòng thử lại sau." />
        </div>
      ) : (
        <div
          ref={containerRef}
          onMouseLeave={() => { if (!selectedId) setHoveredId(null); }}
          style={{
            display: 'flex',
            background: '#fff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            borderTop: `3px solid ${RED}`,
            borderRadius: 8,
            overflow: 'hidden',
            minHeight: 480,
          }}
        >
          {/* Cột trái — danh mục cha */}
          <ul style={{
            listStyle: 'none', margin: 0, padding: 0,
            width: 260, flexShrink: 0,
            borderRight: '1px solid #f3f4f6',
          }}>
            {activeList.map((cat: Category, idx, arr) => {
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
                      padding: '11px 16px',
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
            })}
          </ul>

          {/* Cột phải — danh mục con */}
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            {activeCat ? (
              <>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: RED,
                  textTransform: 'uppercase', marginBottom: 16,
                  paddingBottom: 10, borderBottom: `2px solid ${RED}`,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {(() => { const Icon = SLUG_ICON[activeCat.slug] ?? AppstoreOutlined; return <Icon />; })()}
                  {activeCat.name}
                </div>

                {(activeCat.children ?? []).length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${getColumnCount((activeCat.children ?? []).length)}, 1fr)`,
                    gap: 10,
                  }}>
                    {(activeCat.children ?? []).map((child: ChildCategory) => (
                      <Link
                        key={child.id}
                        to={`${ROUTES.PRODUCTS}?category=${child.slug}`}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          gap: 8, padding: '14px 10px', border: '1px solid #f3f4f6',
                          borderRadius: 8, textDecoration: 'none', background: '#fff', transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.background = '#fef2f2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.background = '#fff'; }}
                      >
                        <div style={{
                          width: '100%', height: 64,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: '#f9fafb', borderRadius: 6, overflow: 'hidden',
                        }}>
                          <ImageWithFallback src={child.image_url ?? ''} alt={child.name} />
                        </div>
                        <span style={{ fontSize: 12, color: '#374151', fontWeight: 500, textAlign: 'center', lineHeight: 1.4 }}>
                          {child.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={`${ROUTES.PRODUCTS}?category=${activeCat.slug}`}
                    style={{ fontSize: 13, color: RED, textDecoration: 'none' }}
                  >
                    Xem tất cả sản phẩm →
                  </Link>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: 14 }}>
                Chọn danh mục để xem sản phẩm
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
