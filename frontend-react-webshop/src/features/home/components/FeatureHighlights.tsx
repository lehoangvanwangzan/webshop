import { COLORS } from '@shared/constants/colors';

const RED = COLORS.primary;
const GREEN = COLORS.success;
const AMBER = '#f59e0b';

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

export function FeatureHighlights() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
      {FEATURES.map(({ icon, title, sub1, sub2, bg, accent }) => (
        <div key={title} style={{
          background: bg,
          borderRadius: 10,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
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
  );
}
