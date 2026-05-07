import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Cột trái — thương hiệu */}
      <div
        style={{
          flex: '0 0 45%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="auth-left-panel"
      >
        {/* Hình trang trí nền */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: -40,
          width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        {/* Nội dung chính */}
        <div style={{ position: 'relative', textAlign: 'center', color: '#fff', maxWidth: 360 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24, fontSize: 36,
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            🛍️
          </div>

          <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 800, letterSpacing: '-0.5px' }}>
            WebShop
          </h1>
          <p style={{ margin: '0 0 40px', fontSize: 16, opacity: 0.85, lineHeight: 1.6 }}>
            Mua sắm thông minh,<br />sống tiện lợi hơn mỗi ngày
          </p>

          {/* Điểm nổi bật của dịch vụ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
            {[
              { icon: '✦', text: 'Hàng ngàn sản phẩm chính hãng' },
              { icon: '✦', text: 'Giao hàng nhanh toàn quốc' },
              { icon: '✦', text: 'Đổi trả dễ dàng trong 30 ngày' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0,
                }}>
                  {icon}
                </span>
                <span style={{ fontSize: 14, opacity: 0.9 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cột phải — form đăng nhập/đăng ký */}
      <div style={{
        flex: 1,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
