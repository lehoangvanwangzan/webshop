import { Link } from 'react-router';
import { Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { CategoryFlyout } from '@features/categories/components/CategoryFlyout';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

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

export function NavBar() {
  return (
    <div style={{ background: RED, position: 'relative', zIndex: 100 }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'stretch',
      }}>
        {/* Category dropdown */}
        <Dropdown
          trigger={['hover']}
          placement="bottomLeft"
          popupRender={() => <CategoryFlyout />}
        >
          <button style={{
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
          }}>
            <MenuOutlined /> DANH MỤC SẢN PHẨM
          </button>
        </Dropdown>

        {/* Nav links */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              style={{
                color: '#fff',
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
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
            background: 'transparent',
            border: '2px solid #fff',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
          }}>
            Yêu cầu báo giá
          </button>
        </div>
      </div>
    </div>
  );
}
