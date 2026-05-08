import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { Badge, Input, Dropdown, ConfigProvider } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  MenuOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@features/auth/stores/auth.store';
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

export function MainLayout() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleSearch = () => {
    if (search.trim()) navigate(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>

      {/* Top bar */}
      <div style={{ background: RED, color: '#fff', fontSize: 12 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span><PhoneOutlined /> Hồ Chí Minh: <strong>0934.666.003</strong></span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a href="#" style={{ color: '#fff', opacity: 0.9, fontSize: 12 }}><QuestionCircleOutlined /> FAQs</a>
            <a href="#" style={{ color: '#fff', opacity: 0.9, fontSize: 12 }}><MailOutlined /> Liên hệ</a>
            <a href="#" style={{ color: '#fff', opacity: 0.9, fontSize: 12 }}>Hỗ trợ kỹ thuật</a>
            {user ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined />
                <span style={{ opacity: 0.9 }}>{user.full_name}</span>
                {user.role === 'admin' && (
                  <Link to={ROUTES.ADMIN_PRODUCTS} style={{ color: '#fef08a', fontSize: 11, fontWeight: 600, border: '1px solid rgba(254,240,138,0.5)', borderRadius: 4, padding: '1px 8px' }}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={clearAuth}
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', borderRadius: 4, padding: '1px 8px', cursor: 'pointer', fontSize: 11 }}
                >
                  Đăng xuất
                </button>
              </span>
            ) : (
              <Link to={ROUTES.LOGIN} style={{ color: '#fff', opacity: 0.9, fontSize: 12 }}>
                <UserOutlined /> Tài khoản
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Logo */}
          <Link to={ROUTES.HOME} style={{ flexShrink: 0 }}>
            <img src="/logo.png" alt="Hoàng Văn" style={{ height: 64, objectFit: 'contain' }} />
          </Link>

          {/* Ô tìm kiếm */}
          <div style={{ flex: 1, maxWidth: 640 }}>
            <ConfigProvider
              theme={{
                token: { colorPrimary: RED, borderRadius: 24 },
                components: {
                  Input: { borderRadius: 24 },
                },
              }}
            >
              <Input.Search
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={handleSearch}
                placeholder="Nhập từ khoá..."
                size="large"
                enterButton={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
                    Tìm kiếm <SearchOutlined />
                  </span>
                }
                allowClear
                style={{ borderRadius: 24 }}
              />
            </ConfigProvider>
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            {/* Hotline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PhoneOutlined style={{ color: '#fff', fontSize: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.2 }}>HOTLINE KINH DOANH</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: RED, lineHeight: 1.2 }}>0934.666.003</div>
              </div>
            </div>

            {/* Cart */}
            <Link to={ROUTES.CART}>
              <Badge count={0} showZero style={{ background: RED }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', border: `2px solid ${RED}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <ShoppingCartOutlined style={{ fontSize: 22, color: RED }} />
                </div>
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div style={{ background: RED, position: 'relative', zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'stretch' }}>
          {/* Danh mục dropdown — Ant Design */}
          <Dropdown
            trigger={['hover']}
            placement="bottomLeft"
            popupRender={() => <CategoryFlyout />}
          >
            <button style={{
              background: RED, border: 'none', color: '#fff',
              padding: '12px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8, height: '100%',
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
                style={{ color: '#fff', padding: '12px 16px', fontSize: 14, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = RED_DARK; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Yêu cầu báo giá */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <button style={{
              background: 'transparent', border: '2px solid #fff',
              color: '#fff', padding: '6px 16px', borderRadius: 6,
              cursor: 'pointer', fontWeight: 600, fontSize: 13,
            }}>
              Yêu cầu báo giá
            </button>
          </div>
        </div>
      </div>
      </div>{/* end sticky header */}

      {/* Page content */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 32px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '32px 16px', marginTop: 32 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          <div>
            <img src="/logo.png" alt="Hoàng Văn" style={{ height: 56, marginBottom: 12, filter: 'brightness(0) invert(1)' }} />
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              Hoàng Văn — Giải pháp công nghệ toàn diện cho doanh nghiệp và cá nhân.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 12 }}>Liên hệ</h4>
            <p style={{ fontSize: 13, lineHeight: 2 }}>
              📞 Hotline: 0934.666.003<br />
              ✉️ Email: sales@hoangvan.vn<br />
              📍 Hà Nội & Hồ Chí Minh
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 12 }}>Chính sách</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
              {['Chính sách bảo hành', 'Chính sách đổi trả', 'Chính sách vận chuyển', 'Điều khoản sử dụng'].map((t) => (
                <a key={t} href="#" style={{ color: '#9ca3af' }}>{t}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '24px auto 0', borderTop: '1px solid #374151', paddingTop: 16, textAlign: 'center', fontSize: 12 }}>
          © 2026 Hoàng Văn — Giải pháp công nghệ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
