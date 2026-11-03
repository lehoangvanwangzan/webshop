import { Link, useNavigate } from 'react-router';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  CustomerServiceOutlined,
  InfoCircleOutlined,
  DownloadOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
  ProfileOutlined,
  DashboardOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@features/auth/stores/auth.store';
import { ROUTES } from '@routes/routes';

const RED = '#d32f2f';

/**
 * Responsive (CSS ở index.css, nhóm .topbar-*):
 *  - ≥1280px: link tiện ích đầy đủ chữ
 *  - 1025–1279px: link tiện ích chỉ còn icon (tooltip bằng title)
 *  - ≤1024px: ẩn link tiện ích, chỉ giữ hotline + menu tài khoản
 *  - ≤480px: menu tài khoản chỉ còn icon
 */
const UTILITY_LINKS = [
  { icon: <InfoCircleOutlined />, label: 'FAQs' },
  { icon: <DownloadOutlined />, label: 'Download' },
  { icon: <MailOutlined />, label: 'Liên hệ' },
  { icon: <SettingOutlined />, label: 'Hỗ trợ kỹ thuật' },
];

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const accountItems: MenuProps['items'] = user
    ? [
        {
          key: 'info',
          disabled: true,
          label: (
            <div style={{ lineHeight: 1.4, cursor: 'default' }}>
              <div style={{ fontWeight: 600, color: '#1f2937' }}>{user.full_name}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{user.email}</div>
            </div>
          ),
        },
        { type: 'divider' },
        {
          key: 'orders',
          icon: <ProfileOutlined />,
          label: <Link to={ROUTES.ORDERS}>Đơn hàng của tôi</Link>,
        },
        ...(user.role === 'admin'
          ? [{
              key: 'admin',
              icon: <DashboardOutlined />,
              label: <Link to={ROUTES.ADMIN}>Trang quản trị</Link>,
            }]
          : []),
        { type: 'divider' },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          danger: true,
          label: 'Đăng xuất',
          onClick: () => {
            clearAuth();
            navigate(ROUTES.HOME);
          },
        },
      ]
    : [];

  return (
    <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e5e7eb', fontSize: 13 }}>
      <div className="topbar-inner">
        {/* Left: contact phones */}
        <div className="topbar-phones">
          <span className="topbar-phone">
            <CustomerServiceOutlined style={{ color: RED, fontSize: 14 }} />
            HN <strong>0938.086.846</strong>
          </span>
          <span className="topbar-sep">|</span>
          <span className="topbar-phone">
            <CustomerServiceOutlined style={{ color: RED, fontSize: 14 }} />
            HCM <strong>0934.666.003</strong>
          </span>
        </div>

        {/* Right: utility links + tài khoản */}
        <div className="topbar-right">
          <nav className="topbar-links">
            {UTILITY_LINKS.map((l) => (
              <a key={l.label} href="#" className="topbar-link" title={l.label}>
                {l.icon} <span className="topbar-link-text">{l.label}</span>
              </a>
            ))}
          </nav>

          {user ? (
            <Dropdown menu={{ items: accountItems }} trigger={['click']} placement="bottomRight">
              <button type="button" className="topbar-account" aria-label="Tài khoản">
                <UserOutlined />
                <span className="topbar-account-name">{user.full_name}</span>
                <DownOutlined style={{ fontSize: 10 }} />
              </button>
            </Dropdown>
          ) : (
            <Link to={ROUTES.LOGIN} className="topbar-account" aria-label="Đăng nhập">
              <UserOutlined />
              <span className="topbar-account-name">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
