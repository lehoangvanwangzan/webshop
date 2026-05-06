import { useState } from 'react';
import { Form, Input, Button, App } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { authApi } from '../api/auth.api';
import type { RegisterDto } from '../types/auth.types';
import { ROUTES } from '@routes/routes';

const PRIMARY = '#6366f1';
const PRIMARY_DARK = '#4f46e5';

const inputStyle = { borderRadius: 10, borderColor: '#e5e7eb' };
const labelStyle: React.CSSProperties = { fontWeight: 500, color: '#374151' };
const iconStyle = { color: '#9ca3af' };

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish = async (values: RegisterDto) => {
    setLoading(true);
    try {
      const { confirm_password: _, ...dto } = values;
      await authApi.register(dto);
      message.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Đăng ký thất bại. Vui lòng thử lại.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 44, height: 44, borderRadius: 12,
          background: `linear-gradient(135deg, ${PRIMARY}, #8b5cf6)`,
          marginBottom: 16, fontSize: 20,
        }}>
          🛍️
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
          Tạo tài khoản mới
        </h2>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Đăng ký để bắt đầu mua sắm ngay hôm nay
        </p>
      </div>

      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        size="large"
      >
        {/* Họ tên + SĐT trên cùng hàng */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item
            name="full_name"
            label={<span style={labelStyle}>Họ và tên</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' },
              { min: 2, message: 'Ít nhất 2 ký tự' },
            ]}
          >
            <Input prefix={<UserOutlined style={iconStyle} />} placeholder="Nguyễn Văn A" style={inputStyle} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span style={labelStyle}>
                Số điện thoại{' '}
                <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 12 }}>(tuỳ chọn)</span>
              </span>
            }
            rules={[{ pattern: /^(0|\+84)[0-9]{9}$/, message: 'SĐT không hợp lệ' }]}
          >
            <Input prefix={<PhoneOutlined style={iconStyle} />} placeholder="0901234567" style={inputStyle} />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label={<span style={labelStyle}>Email</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input prefix={<MailOutlined style={iconStyle} />} placeholder="you@example.com" style={inputStyle} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item
            name="password"
            label={<span style={labelStyle}>Mật khẩu</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Ít nhất 6 ký tự' },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined style={iconStyle} />} placeholder="••••••••" style={inputStyle} />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label={<span style={labelStyle}>Xác nhận</span>}
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined style={iconStyle} />} placeholder="••••••••" style={inputStyle} />
          </Form.Item>
        </div>

        <Form.Item style={{ marginBottom: 16, marginTop: 4 }}>
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
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 8, color: '#6b7280', fontSize: 14 }}>
        Đã có tài khoản?{' '}
        <Link to={ROUTES.LOGIN} style={{ color: PRIMARY, fontWeight: 600 }}>
          Đăng nhập
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
