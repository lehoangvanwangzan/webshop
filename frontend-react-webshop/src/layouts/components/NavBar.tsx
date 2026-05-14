import { useState } from 'react';
import { Link } from 'react-router';
import { Dropdown, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { CategoryFlyout } from '@features/categories/components/CategoryFlyout';
import { CategoryAccordionList } from '@features/home/components/HomeCategories';
import { useCategories } from '@features/categories/hooks/useCategories';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

import './NavBar.css';

const RED = COLORS.primary;
const RED_DARK = COLORS.primaryDark;

const NAV_LINKS = [
  { label: 'TRANG CHỦ', path: ROUTES.HOME },
  { label: 'THƯƠNG HIỆU', path: ROUTES.BRANDS },
  { label: 'VỀ HOÀNG VĂN', path: '#' },
  { label: 'GIẢI PHÁP', path: '#' },
  { label: 'HƯỚNG DẪN', path: '#' },
  { label: 'TIN TỨC', path: '#' },
];

const btnStyle = {
  background: RED,
  border: 'none',
  color: '#fff',
  padding: '12px 20px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: '100%',
  whiteSpace: 'nowrap' as const,
};

export function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: categories, isLoading } = useCategories();

  return (
    <div style={{ background: RED, position: 'relative', zIndex: 100 }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'stretch',
      }}>

        {/* Desktop: hover Dropdown */}
        <div className="nav-category-desktop">
          <Dropdown
            trigger={['hover']}
            placement="bottomLeft"
            popupRender={() => <CategoryFlyout />}
          >
            <button style={btnStyle}>
              <MenuOutlined /> DANH MỤC
            </button>
          </Dropdown>
        </div>

        {/* Mobile/Tablet: chỉ icon 3 gạch, click mở Drawer */}
        <div className="nav-category-mobile">
          <button
            style={{ ...btnStyle, padding: '12px 14px', fontSize: 20 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuOutlined />
          </button>
          <Drawer
            title={<span style={{ color: RED, fontWeight: 700, fontSize: 16 }}>Danh mục sản phẩm</span>}
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            styles={{ body: { padding: '8px 16px' } }}
          >
            <CategoryAccordionList
              categories={(categories ?? []) as Parameters<typeof CategoryAccordionList>[0]['categories']}
              isLoading={isLoading ?? false}
              onNavigate={() => setDrawerOpen(false)}
            />
          </Drawer>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', overflow: 'hidden' }}>
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              style={{ color: '#fff', padding: '12px 16px', fontSize: 14, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = RED_DARK; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Quote button */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <button style={{
            background: 'transparent', border: '2px solid #fff', color: '#fff',
            padding: '6px 16px', borderRadius: 6, cursor: 'pointer',
            fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap',
          }}>
            Yêu cầu báo giá
          </button>
        </div>
      </div>
    </div>
  );
}
