import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router';
import { Badge, Drawer } from 'antd';
import {
  ShoppingCartOutlined, SearchOutlined, PhoneFilled,
  MenuOutlined, AppstoreOutlined, RightOutlined,
} from '@ant-design/icons';
import styles from './MainHeader.module.css';
import { useCategories } from '@features/categories/hooks/useCategories';
import { SLUG_ICON } from '@features/categories/constants/categoryIcons';
import { ImageWithFallback } from '@features/categories/components/ImageWithFallback';
import { CategoryAccordionList } from '@features/home/components/HomeCategories';
import type { Category, ChildCategory } from '@features/categories/types/categories.types';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

const RED = COLORS.primary;

function getColumnCount(n: number) {
  if (n <= 4) return 2;
  if (n <= 9) return 3;
  return 4;
}

function CategoryPanel({ onClose, onMouseEnter, onMouseLeave }: {
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const { data: categories } = useCategories();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const activeId = selectedId ?? hoveredId;
  const activeCat = activeId ? (categories ?? []).find((c) => c.id === activeId) : null;

  const handleParentClick = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => { if (!selectedId) onMouseLeave(); }}
      style={{ display: 'flex', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderTop: `3px solid ${RED}`, borderRadius: 8, overflow: 'hidden' }}
    >
      {/* Cột trái — danh mục cha */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: 260, flexShrink: 0, borderRight: '1px solid #f3f4f6' }}>
        {(categories ?? []).filter((c: Category) => c.is_active).map((cat: Category, idx, arr) => {
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
        })}
      </ul>

      {/* Cột phải — danh mục con */}
      {activeCat && (activeCat.children ?? []).length > 0 && (
        <div
          onMouseEnter={() => setHoveredId(activeCat.id)}
          style={{ padding: '16px 20px', minWidth: 380, maxWidth: 560, overflowY: 'auto' }}
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
                onClick={onClose}
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

export function MainHeader() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 24 });
  const { data: categories, isLoading } = useCategories();
  const headerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim()) navigate(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(search.trim())}`);
  };

  /* Tính vị trí panel dựa theo bottom của header sticky + left của content area */
  const calcPanelPos = useCallback(() => {
    const stickyEl = headerRef.current?.closest<HTMLElement>('[style*="sticky"]');
    const top = stickyEl
      ? stickyEl.getBoundingClientRect().bottom
      : (headerRef.current?.getBoundingClientRect().bottom ?? 80);
    const left = Math.max(24, (window.innerWidth - 1440) / 2 + 24);
    setPanelPos({ top, left });
  }, []);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimer.current);
    calcPanelPos();
    setMenuOpen(true);
  }, [calcPanelPos]);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 120);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {menuOpen && createPortal(
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.18)',
            backdropFilter: 'blur(1px)',
            zIndex: 999,
          }}
        />,
        document.body,
      )}

      {/* Panel danh mục — render đúng vị trí HomeCategories */}
      {menuOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: panelPos.top,
          left: panelPos.left,
          zIndex: 1001,
        }}>
          <CategoryPanel
            onClose={() => setMenuOpen(false)}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        </div>,
        document.body,
      )}

      <div ref={headerRef} style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1000 }}>
        <div className={styles.inner}>

          {/* Logo area: desktop=[logo | divider | btn-danh-muc], mobile=[btn-menu | logo | cart] */}
          <div className={styles.logoArea}>
            {/* Nút menu — desktop: hover panel + text, mobile: click Drawer + chỉ icon */}
            <button
              onMouseEnter={() => { if (window.innerWidth > 1024) openMenu(); }}
              onMouseLeave={() => { if (window.innerWidth > 1024) scheduleClose(); }}
              onClick={() => { if (window.innerWidth <= 1024) setDrawerOpen(true); }}
              style={{
                background: menuOpen ? '#b71c1c' : RED,
                border: 'none', color: '#fff',
                padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
                fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 8,
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                letterSpacing: 0.3, transition: 'background 0.2s',
              }}
            >
              <MenuOutlined style={{ fontSize: 16 }} />
              <span className={styles.danhMucText}>Danh mục</span>
            </button>

            <Link to={ROUTES.HOME} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: '#333', letterSpacing: '-0.5px' }}>HOÀNG</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: RED, marginLeft: 5, letterSpacing: '-0.5px', position: 'relative' }}>
                  VĂN
                  <span style={{ position: 'absolute', top: -4, left: 0, width: 7, height: 4, background: RED, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                </span>
              </div>
            </Link>

            {/* Cart chỉ hiện trên mobile (desktop dùng cart trong rightArea) */}
            <div className={styles.cartMobile}>
              <Link to={ROUTES.CART}>
                <Badge count={0} showZero style={{ background: '#374151' }}>
                  <div style={{ padding: 6, cursor: 'pointer' }}>
                    <ShoppingCartOutlined style={{ fontSize: 26, color: RED }} />
                  </div>
                </Badge>
              </Link>
            </div>
          </div>

          {/* Search bar — desktop: inline, mobile: ẩn (dùng mobileSearchRow) */}
          <div className={styles.searchArea}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f0f2f5', borderRadius: 999, overflow: 'hidden' }}>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nhập từ khoá..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '10px 20px', fontSize: 14, color: '#374151' }}
              />
              <button onClick={handleSearch}
                style={{ background: RED, border: 'none', color: '#fff', padding: '10px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#b71c1c')}
                onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
              >
                Tìm kiếm <SearchOutlined />
              </button>
            </div>
          </div>

          {/* Right: Hotline + Cart — desktop only */}
          <div className={styles.rightArea}>
            <div className={styles.hotline}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fef2f2', border: `2px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PhoneFilled style={{ color: RED, fontSize: 18 }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, letterSpacing: 0.3, marginBottom: 1 }}>HOTLINE KINH DOANH</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: RED, lineHeight: 1 }}>0934.666.003</div>
              </div>
            </div>
            <Link to={ROUTES.CART}>
              <Badge count={0} showZero style={{ background: '#374151' }}>
                <div style={{ padding: 6, cursor: 'pointer' }}>
                  <ShoppingCartOutlined style={{ fontSize: 26, color: RED }} />
                </div>
              </Badge>
            </Link>
          </div>

          {/* Search row mobile — full width, dòng 2 */}
          <div className={styles.mobileSearchRow}>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', background: '#f0f2f5', borderRadius: 999, overflow: 'hidden' }}>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nhập từ khoá..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '9px 16px', fontSize: 14, color: '#374151' }}
              />
              <button onClick={handleSearch}
                style={{ background: RED, border: 'none', color: '#fff', padding: '9px 18px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <SearchOutlined />
              </button>
            </div>
          </div>

          {/* Drawer danh mục */}
          <Drawer
            title={<span style={{ color: RED, fontWeight: 700, fontSize: 16 }}>Danh mục sản phẩm</span>}
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            styles={{ body: { padding: '8px 16px' } }}
          >
            <CategoryAccordionList
              categories={(categories ?? []) as Category[]}
              isLoading={isLoading ?? false}
              onNavigate={() => setDrawerOpen(false)}
            />
          </Drawer>

        </div>
      </div>
    </>
  );
}
