import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { Badge, Input, Dropdown, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import {
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  MenuOutlined,
  SearchOutlined,
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
} from '@ant-design/icons';
import { useAuthStore } from '@features/auth/stores/auth.store';
import { useCategories } from '@features/categories/hooks/useCategories';
import { ROUTES } from '@routes/routes';

const RED = '#dc2626';
const RED_DARK = '#b91c1c';
const GREEN = '#16a34a';


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
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { data: categories = [] } = useCategories();

  const activeCat = activeCatId
    ? categories.find((c) => c.id === activeCatId)
    : categories[0];

  const handleSearch = () => {
    if (search.trim()) navigate(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
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
            popupRender={() => (
              <div style={{
                display: 'flex',
                background: '#fff',
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                borderRadius: '0 0 8px 8px',
                borderTop: `3px solid ${RED}`,
                overflow: 'hidden',
                minHeight: 420,
              }}>
                {/* Cột trái — danh mục cha */}
                <div style={{ width: 240, borderRight: '1px solid #f3f4f6', flexShrink: 0 }}>
                  {categories.map((cat) => {
                    const isActive = activeCat?.id === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onMouseEnter={() => setActiveCatId(cat.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', fontSize: 13, cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6',
                          background: isActive ? '#fef2f2' : '#fff',
                          color: isActive ? RED : '#374151',
                          transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ fontSize: 15, width: 18, textAlign: 'center', color: isActive ? RED : '#9ca3af' }}>
                          {SLUG_ICON[cat.slug] ?? <AppstoreOutlined />}
                        </span>
                        <span style={{ flex: 1, fontWeight: isActive ? 600 : 400 }}>{cat.name}</span>
                        <span style={{ fontSize: 10, color: '#d1d5db' }}>›</span>
                      </div>
                    );
                  })}
                </div>

                {/* Cột phải — danh mục con dạng card có logo */}
                <div style={{ flex: 1, padding: '14px 16px', minWidth: 340, overflowY: 'auto' }}>
                  {activeCat && (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${RED}` }}>
                        {activeCat.name}
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${(activeCat.children ?? []).length <= 4 ? 2 : (activeCat.children ?? []).length <= 9 ? 3 : 4}, 1fr)`,
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
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = RED;
                              el.style.boxShadow = '0 4px 12px rgba(220,38,38,0.12)';
                              el.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.borderColor = '#f3f4f6';
                              el.style.boxShadow = 'none';
                              el.style.transform = 'translateY(0)';
                            }}
                          >
                            <div style={{
                              width: '100%', height: 52, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              background: '#f9fafb', borderRadius: 4, overflow: 'hidden',
                            }}>
                              {child.image_url ? (
                                <img
                                  src={child.image_url}
                                  alt={child.name}
                                  style={{ maxWidth: '80%', maxHeight: 36, objectFit: 'contain' }}
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    img.style.display = 'none';
                                    const fb = document.createElement('div');
                                    fb.style.cssText = `width:32px;height:32px;border-radius:50%;background:${RED};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px`;
                                    fb.innerText = child.name.charAt(0).toUpperCase();
                                    img.parentElement?.appendChild(fb);
                                  }}
                                />
                              ) : (
                                <div style={{
                                  width: 32, height: 32, borderRadius: '50%',
                                  background: RED, color: '#fff',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: 700, fontSize: 14,
                                }}>
                                  {child.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span style={{
                              fontSize: 11, color: '#374151', fontWeight: 500,
                              textAlign: 'center', lineHeight: 1.3,
                            }}>
                              {child.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
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
