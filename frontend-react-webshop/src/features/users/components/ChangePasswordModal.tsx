import { Modal, Form, Input, App } from 'antd';
import { useChangePassword } from '../hooks/useUsers';
import type { AdminUser } from '../types/users.types';

interface Props {
  open: boolean;
  onClose: () => void;
  user?: AdminUser;
}

interface FormValues {
  new_password: string;
  confirm_password: string;
}

export function ChangePasswordModal({ open, onClose, user }: Props) {
  const [form] = Form.useForm<FormValues>();
  const { message } = App.useApp();
  const changePassword = useChangePassword();

  const handleSubmit = async ({ new_password }: FormValues) => {
    if (!user) return;
    try {
      await changePassword.mutateAsync({ id: user.id, new_password });
      message.success(`Đã đổi mật khẩu cho ${user.full_name}`);
      form.resetFields();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      message.error(msg);
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={open}
      onCancel={() => { form.resetFields(); onClose(); }}
      onOk={() => form.submit()}
      okText="Đổi mật khẩu"
      cancelText="Hủy"
      confirmLoading={changePassword.isPending}
      width={420}
      destroyOnClose
    >
      {user && (
        <div style={{
          marginBottom: 16, padding: '10px 14px',
          background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb',
        }}>
          <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{user.full_name}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{user.email}</div>
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mật khẩu mới"
          name="new_password"
          rules={[
            { required: true, message: 'Nhập mật khẩu mới' },
            { min: 6, message: 'Tối thiểu 6 ký tự' },
            { max: 64, message: 'Tối đa 64 ký tự' },
          ]}
        >
          <Input.Password placeholder="Tối thiểu 6 ký tự" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm_password"
          dependencies={['new_password']}
          rules={[
            { required: true, message: 'Xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
