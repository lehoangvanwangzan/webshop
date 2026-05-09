import { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { ROUTES } from '@routes/routes';

const SLIDES = [
  {
    subtitle: 'CÔNG TY TNHH CÔNG NGHỆ HOÀNG VĂN',
    title: 'Nhà cung cấp giải pháp tổng thể\ncho doanh nghiệp',
    boxes: [
      'HẠ TẦNG MẠNG, WIFI, ROUTER, SWITCH, FIREWALL',
      'THIẾT BỊ LƯU TRỮ, QUẢN LÝ DỮ LIỆU',
      'GIẢI PHÁP QUẢN LÝ GHI HÌNH',
    ],
    gradient: 'linear-gradient(135deg, #800000 0%, #d32f2f 100%)',
  },
  {
    subtitle: 'PHÂN PHỐI CHÍNH HÃNG · BẢO HÀNH ĐẦY ĐỦ',
    title: 'Thiết bị mạng doanh nghiệp\nchính hãng tại Việt Nam',
    boxes: [
      'MIKROTIK · UBIQUITI · RUCKUS',
      'SYNOLOGY · QNAP · FORTINET',
      'TƯ VẤN & HỖ TRỢ KỸ THUẬT 24/7',
    ],
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  },
];

export function PromoBanners() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setActive((i) => (i + 1) % SLIDES.length);

  const slide = SLIDES[active];

  return (
    <div style={{
      flex: 1,
      minHeight: 380,
      background: slide.gradient,
      borderRadius: 2,
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 48px',
      textAlign: 'center',
      transition: 'background 0.4s',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', left: -40, bottom: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      {/* Content */}
      <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 16, letterSpacing: 0.5 }}>
        {slide.subtitle}
      </p>
      <h2 style={{
        fontSize: 36,
        fontWeight: 800,
        lineHeight: 1.25,
        marginBottom: 28,
        whiteSpace: 'pre-line',
        textTransform: 'uppercase',
      }}>
        {slide.title}
      </h2>

      {/* Info boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', maxWidth: 720, marginBottom: 32 }}>
        {slide.boxes.map((box, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 6,
            padding: '12px 14px',
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1.5,
          }}>
            {box}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to={ROUTES.PRODUCTS}>
          <button style={{
            background: '#fff',
            color: '#d32f2f',
            border: 'none',
            padding: '10px 28px',
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
          }}>
            Xem sản phẩm →
          </button>
        </Link>
        <button style={{
          background: 'transparent',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.6)',
          padding: '10px 28px',
          borderRadius: 4,
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
        }}>
          Yêu cầu báo giá
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 6 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 4,
              borderRadius: 2,
              background: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Nav arrows */}
      {[
        { side: 'left' as const, action: prev, Icon: LeftOutlined },
        { side: 'right' as const, action: next, Icon: RightOutlined },
      ].map(({ side, action, Icon }) => (
        <button
          key={side}
          onClick={action}
          style={{
            position: 'absolute',
            [side]: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.2)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
