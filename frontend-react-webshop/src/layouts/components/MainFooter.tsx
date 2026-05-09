const POLICY_LINKS = [
  'Chính sách bảo hành',
  'Chính sách đổi trả',
  'Chính sách vận chuyển',
  'Điều khoản sử dụng',
];

export function MainFooter() {
  return (
    <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '32px 16px', marginTop: 32 }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 32,
      }}>
        {/* Branding */}
        <div>
          <img
            src="/logo.png"
            alt="Hoàng Văn"
            style={{ height: 56, marginBottom: 12, filter: 'brightness(0) invert(1)' }}
          />
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>
            Hoàng Văn — Giải pháp công nghệ toàn diện cho doanh nghiệp và cá nhân.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Liên hệ</h4>
          <p style={{ fontSize: 13, lineHeight: 2 }}>
            📞 Hotline: 0934.666.003<br />
            ✉️ Email: sales@hoangvan.vn<br />
            📍 Hà Nội &amp; Hồ Chí Minh
          </p>
        </div>

        {/* Policies */}
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Chính sách</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            {POLICY_LINKS.map((t) => (
              <a key={t} href="#" style={{ color: '#9ca3af' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        maxWidth: 1440,
        margin: '24px auto 0',
        padding: '16px 24px 0',
        borderTop: '1px solid #374151',
        textAlign: 'center',
        fontSize: 12,
      }}>
        © 2026 Hoàng Văn — Giải pháp công nghệ. All rights reserved.
      </div>
    </footer>
  );
}
