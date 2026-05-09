import { Link } from 'react-router';
import { COLORS } from '@shared/constants/colors';
import { ROUTES } from '@routes/routes';

const RED = COLORS.primary;
const AMBER = '#f59e0b';

export function HeroBanner() {
  return (
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
          Tư vấn &amp; hỗ trợ kỹ thuật 24/7 toàn quốc.
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
  );
}
