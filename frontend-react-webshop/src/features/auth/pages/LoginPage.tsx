import { useState } from 'react';
import { Form, Input, Button, Checkbox, App } from 'antd';
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import type { LoginDto } from '../types/auth.types';
import { ROUTES } from '@routes/routes';

const PRIMARY = '#6366f1';
const PRIMARY_DARK = '#4f46e5';

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const from = (location.state as { from?: string })?.from ?? ROUTES.HOME;

  const onFinish = async (values: LoginDto) => {
    setLoading(true);
    try {
      const data = await authApi.login(values);
      setAuth(data.user, data.access_token);
      message.success('Đăng nhập thành công!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Đăng nhập thất bại. Vui lòng thử lại.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 44, height: 44, borderRadius: 12,
          background: `linear-gradient(135deg, ${PRIMARY}, #8b5cf6)`,
          marginBottom: 16, fontSize: 20,
        }}>
          🛍️
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
          Chào mừng trở lại 👋
        </h2>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Đăng nhập để tiếp tục mua sắm
        </p>
      </div>

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        size="large"
      >
        <Form.Item
          name="email"
          label={<span style={{ fontWeight: 500, color: '#374151' }}>Email</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
            placeholder="you@example.com"
            style={{ borderRadius: 10, borderColor: '#e5e7eb' }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: '#374151' }}>Mật khẩu</span>
              <a href="#" style={{ fontSize: 13, color: PRIMARY, fontWeight: 500 }}>
                Quên mật khẩu?
              </a>
            </div>
          }
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="••••••••"
            style={{ borderRadius: 10, borderColor: '#e5e7eb' }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 20 }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ color: '#6b7280', fontSize: 13 }}>Nhớ đăng nhập</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            icon={!loading ? <ArrowRightOutlined /> : undefined}
            style={{
              height: 46,
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              background: `linear-gradient(135deg, ${PRIMARY}, #8b5cf6)`,
              border: 'none',
              boxShadow: `0 4px 14px ${PRIMARY}40`,
            }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 8, color: '#6b7280', fontSize: 14 }}>
        Chưa có tài khoản?{' '}
        <Link to={ROUTES.REGISTER} style={{ color: PRIMARY, fontWeight: 600 }}>
          Tạo tài khoản mới
        </Link>
      </div>

      <style>{`
        .ant-btn-primary:hover {
          background: linear-gradient(135deg, ${PRIMARY_DARK}, #7c3aed) !important;
          box-shadow: 0 4px 20px ${PRIMARY}60 !important;
        }
        .ant-input-affix-wrapper,
        .ant-input {
          background-color: #f5f3ff !important;
        }
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: ${PRIMARY} !important;
          box-shadow: 0 0 0 3px ${PRIMARY}20 !important;
          background-color: #fff !important;
        }
        .ant-input:-webkit-autofill,
        .ant-input:-webkit-autofill:hover,
        .ant-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #f5f3ff inset !important;
          -webkit-text-fill-color: #111827 !important;
          caret-color: #111827;
        }
      `}</style>
    </>
  );
}
