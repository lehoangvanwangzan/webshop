import { Link } from 'react-router';
import { ShoppingCartOutlined, RightOutlined } from '@ant-design/icons';
import { ROUTES } from '@routes/routes';

const RED = '#dc2626';
const GREEN = '#16a34a';
const AMBER = '#f59e0b';

/* Mock data */
const MOCK_PRODUCTS = [
  { id: 1, name: 'Bộ phát Wifi UniFi AC Pro (UAP-AC-Pro) 1750Mbps', price: 4968000, badge: 'BÁN CHẠY', img: null },
  { id: 2, name: 'Thiết bị cân bằng tải Router MikroTik CCR2004-16G-2S+', price: 13200000, badge: 'BÁN CHẠY', img: null },
  { id: 3, name: 'Bộ phát Wifi Ruckus R650 WiFi 6 (901-R650-WW00)', price: 0, badge: null, img: null },
  { id: 4, name: 'MikroTik RB4011iGS+RM, Thiết bị cân bằng tải Router', price: 6200000, badge: 'BÁN CHẠY', img: null },
  { id: 5, name: 'Thiết bị lưu trữ NAS Synology DS925+', price: 0, badge: null, img: null },
];

const FEATURES = [
  {
    icon: '✅',
    title: 'CAM KẾT CHẤT LƯỢNG',
    sub1: 'ĐẦY ĐỦ CO/CQ',
    sub2: 'BẢO HÀNH CHÍNH HÃNG',
    bg: '#fef2f2',
    accent: RED,
  },
  {
    icon: '🎧',
    title: 'HỖ TRỢ CHUYÊN NGHIỆP',
    sub1: 'SUPPORT TẬN TÂM',
    sub2: 'TƯ VẤN MIỄN PHÍ',
    bg: '#f0fdf4',
    accent: GREEN,
  },
  {
    icon: '🚚',
    title: 'GIAO HÀNG TOÀN QUỐC',
    sub1: 'NHANH CHÓNG',
    sub2: 'MIỄN PHÍ',
    bg: '#fffbeb',
    accent: AMBER,
  },
];

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function HomePage() {
  return (
    <div style={{ paddingTop: 16 }}>
      {/* Hero banner */}
      <div style={{
        borderRadius: 12,
        background: `linear-gradient(135deg, ${RED} 0%, #ef4444 40%, ${AMBER} 100%)`,
        padding: '48px 56px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -60, top: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <img src="/logo.png" alt="Logo" style={{ height: 52, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>HOÀNG VĂN</span>
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            ĐỐI TÁC PHÂN PHỐI<br />
            <span style={{ color: '#fef08a' }}>THIẾT BỊ MẠNG</span><br />
            CHÍNH HÃNG TẠI VIỆT NAM
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 15, opacity: 0.9, lineHeight: 1.6 }}>
            Cung cấp thiết bị mạng chính hãng — bảo hành đầy đủ CO/CQ.<br />
            Tư vấn & hỗ trợ kỹ thuật 24/7 toàn quốc.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to={ROUTES.PRODUCTS}>
              <button style={{
                background: '#fff', color: RED, border: 'none',
                padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15,
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                Xem sản phẩm →
              </button>
            </Link>
            <button style={{
              background: 'transparent', color: '#fff',
              border: '2px solid rgba(255,255,255,0.7)',
              padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15,
              cursor: 'pointer',
            }}>
              Yêu cầu báo giá
            </button>
          </div>
        </div>

        {/* Right illustration */}
        <div style={{ position: 'relative', fontSize: 100, opacity: 0.15, fontWeight: 900, letterSpacing: -4 }}>
          🖥️
        </div>
      </div>

      {/* Feature highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {FEATURES.map(({ icon, title, sub1, sub2, bg, accent }) => (
          <div key={title} style={{
            background: bg, borderRadius: 10,
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
            border: `1px solid ${accent}22`,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: `${accent}18`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28, flexShrink: 0,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: accent, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                <span style={{
                  background: `${accent}18`, color: accent,
                  padding: '2px 8px', borderRadius: 4, marginRight: 6, fontWeight: 600,
                }}>
                  {sub1}
                </span>
                <span style={{
                  background: `${accent}18`, color: accent,
                  padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                }}>
                  {sub2}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sản phẩm nổi bật */}
      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        {/* Header */}
        <div style={{
          background: RED, padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 700 }}>
            🔥 SẢN PHẨM NỔI BẬT
          </h2>
          <Link to={ROUTES.PRODUCTS} style={{ color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            Xem tất cả <RightOutlined />
          </Link>
        </div>

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
          {MOCK_PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              style={{
                padding: 16, cursor: 'pointer', position: 'relative',
                borderRight: i < 4 ? '1px solid #f3f4f6' : 'none',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 2px #dc262622 inset'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              {p.badge && (
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  background: RED, color: '#fff',
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                }}>
                  {p.badge}
                </div>
              )}

              {/* Product image placeholder */}
              <div style={{
                width: '100%', aspectRatio: '1',
                background: '#f9fafb', borderRadius: 8, marginBottom: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 48,
              }}>
                🖥️
              </div>

              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.4, marginBottom: 10, minHeight: 52 }}>
                {p.name}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: p.price ? RED : '#6b7280' }}>
                  {p.price ? formatPrice(p.price) : 'Liên hệ'}
                </div>
                <button style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: RED, border: 'none', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 14,
                }}>
                  <ShoppingCartOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner đôi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
        {/* Banner 1 */}
        <div style={{
          borderRadius: 10, padding: '28px 32px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #38bdf8 100%)',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>WIFI UNIFI</div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>
            AP U7 LITE<br /><span style={{ color: '#bfdbfe' }}>CAO CẤP</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 16 }}>
            Phủ sóng xa · Tốc độ cao · Wifi chuẩn 6E · Chi phí tiết kiệm
          </div>
          <button style={{
            background: '#fff', color: '#1d4ed8', border: 'none',
            padding: '8px 18px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>
            MUA NGAY →
          </button>
        </div>

        {/* Banner 2 */}
        <div style={{
          borderRadius: 10, padding: '28px 32px',
          background: `linear-gradient(135deg, #7c3aed 0%, #8b5cf6 60%, #a78bfa 100%)`,
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>Router MikroTik</div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginBottom: 6 }}>
            RB4011iGS+RM<br />
            <span style={{ color: '#ede9fe' }}>
              Giá chỉ từ{' '}
              <span style={{ color: '#fef08a', fontSize: 20 }}>6.200.000đ</span>
            </span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 16 }}>
            10 cổng Gigabit · SFP+ 10Gbps · Hiệu năng cao
          </div>
          <button style={{
            background: '#fff', color: '#7c3aed', border: 'none',
            padding: '8px 18px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>
            MUA NGAY →
          </button>
        </div>
      </div>
    </div>
  );
}
