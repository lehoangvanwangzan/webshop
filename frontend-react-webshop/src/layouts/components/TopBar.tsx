import { Link } from 'react-router';
import {
  CustomerServiceOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@features/auth/stores/auth.store';
import { ROUTES } from '@routes/routes';

const RED = '#d32f2f';

const linkStyle: React.CSSProperties = {
  color: '#4b5563',
  fontSize: 13,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  textDecoration: 'none',
  transition: 'color 0.2s',
};

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return (
    <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: '0 24px',
        height: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Left: contact phones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#4b5563' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CustomerServiceOutlined style={{ color: RED, fontSize: 14 }} />
            Hà Nội <strong style={{ color: '#1f2937', marginLeft: 4 }}>0938.086.846</strong>
          </span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CustomerServiceOutlined style={{ color: RED, fontSize: 14 }} />
            Hồ Chí Minh <strong style={{ color: '#1f2937', marginLeft: 4 }}>0934.666.003</strong>
          </span>
        </div>

        {/* Right: utility links + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="#" style={linkStyle} className="topbar-link">
            <InfoCircleOutlined /> FAQs
          </a>
          <a href="#" style={linkStyle} className="topbar-link">
            <DownloadOutlined /> Download
          </a>
          <a href="#" style={linkStyle} className="topbar-link">
            <MailOutlined /> Liên hệ
          </a>
          <a href="#" style={linkStyle} className="topbar-link">
            <SettingOutlined /> Hỗ trợ kỹ thuật
          </a>

          {user ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563' }}>
              <UserOutlined />
              <span style={{ fontSize: 13 }}>{user.full_name}</span>
              {user.role === 'admin' && (
                <Link
                  to={ROUTES.ADMIN_PRODUCTS}
                  style={{
                    color: RED,
                    fontSize: 11,
                    fontWeight: 600,
                    border: `1px solid ${RED}`,
                    borderRadius: 4,
                    padding: '1px 8px',
                    textDecoration: 'none',
                  }}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={clearAuth}
                style={{
                  background: 'none',
                  border: '1px solid #d1d5db',
                  color: '#6b7280',
                  borderRadius: 4,
                  padding: '1px 8px',
                  cursor: 'pointer',
                  fontSize: 11,
                }}
              >
                Đăng xuất
              </button>
            </span>
          ) : (
            <Link to={ROUTES.LOGIN} style={{ ...linkStyle, textDecoration: 'none' }}>
              <UserOutlined /> Tài khoản
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
