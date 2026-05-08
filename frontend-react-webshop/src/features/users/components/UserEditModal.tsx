import { useEffect, useState } from 'react';
import {
  Modal, Form, Input, Select, Switch, App,
  Row, Col, Avatar, Upload, Button, Popconfirm,
} from 'antd';
import {
  UserOutlined, CameraOutlined, DeleteOutlined,
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload';
import { useCreateUser, useUpdateUser, useUpdateAvatar, useRemoveAvatar } from '../hooks/useUsers';
import { resolveAvatarUrl } from '../api/users.api';
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from '../types/users.types';

interface Props {
  open: boolean;
  onClose: () => void;
  user?: AdminUser;
}

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Nhân viên', value: 'staff' },
  { label: 'Khách hàng', value: 'customer' },
];

type FormValues = Omit<CreateUserPayload, 'avatar'>;

export function UserEditModal({ open, onClose, user }: Props) {
  const [form] = Form.useForm<FormValues>();
  const { message } = App.useApp();
  const isEditMode = !!user;

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createUser   = useCreateUser();
  const updateUser   = useUpdateUser();
  const updateAvatar = useUpdateAvatar();
  const removeAvatar = useRemoveAvatar();

  // Reset khi mở/đóng modal
  useEffect(() => {
    if (open) {
      setAvatarFile(null);
      setPreviewUrl(null);
      if (user) {
        form.setFieldsValue({
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_active: user.is_active,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ role: 'customer', is_active: true });
      }
    }
  }, [open, user, form]);

  // Preview ảnh trước khi upload
  const handleBeforeUpload = (file: RcFile): false => {
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) { message.error('Chỉ chấp nhận file ảnh'); return false; }
    if (!isLt5M)  { message.error('Ảnh phải nhỏ hơn 5 MB'); return false; }

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false; // chặn auto-upload
  };

  const handleRemovePreview = () => {
    setAvatarFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEditMode) {
        // 1. Cập nhật thông tin
        const { email: _e, password: _p, ...payload } = values;
        await updateUser.mutateAsync({ id: user.id, payload: payload as UpdateUserPayload });

        // 2. Cập nhật avatar nếu có chọn mới
        if (avatarFile) {
          await updateAvatar.mutateAsync({ id: user.id, file: avatarFile });
        }
        message.success('Cập nhật người dùng thành công');
      } else {
        // Tạo mới kèm avatar (1 request multipart)
        await createUser.mutateAsync({ ...values, avatar: avatarFile ?? undefined });
        message.success('Thêm người dùng thành công');
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Có lỗi xảy ra. Vui lòng thử lại.';
      message.error(msg);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user) return;
    try {
      await removeAvatar.mutateAsync(user.id);
      message.success('Đã xoá ảnh đại diện');
    } catch {
      message.error('Xoá ảnh thất bại');
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending || updateAvatar.isPending;

  // Ảnh hiển thị: preview file mới > ảnh từ server > fallback icon
  const hasServerAvatar = isEditMode && !!user.avatar_url;
  const displaySrc = previewUrl ?? (hasServerAvatar ? resolveAvatarUrl(user!.avatar_url) : undefined);

  return (
    <Modal
      title={isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEditMode ? 'Lưu thay đổi' : 'Thêm người dùng'}
      cancelText="Hủy"
      confirmLoading={isLoading}
      width={560}
      destroyOnClose
    >
      {/* ─── Avatar picker ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            size={80}
            src={displaySrc}
            icon={!displaySrc ? <UserOutlined /> : undefined}
            style={{ background: '#e0e7ff', color: '#6366f1', fontSize: 32 }}
          />
          {/* Nút xoá ảnh server */}
          {isEditMode && hasServerAvatar && !previewUrl && (
            <Popconfirm
              title="Xoá ảnh đại diện?"
              okText="Xoá"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={handleDeleteAvatar}
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 22, height: 22, padding: 0,
                  borderRadius: '50%', fontSize: 11,
                }}
              />
            </Popconfirm>
          )}
          {/* Nút huỷ preview */}
          {previewUrl && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemovePreview}
              style={{
                position: 'absolute', top: -4, right: -4,
                width: 22, height: 22, padding: 0,
                borderRadius: '50%', fontSize: 11,
              }}
            />
          )}
        </div>

        <div>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            fileList={avatarFile ? [{ uid: '-1', name: avatarFile.name, status: 'done' } as UploadFile] : []}
          >
            <Button icon={<CameraOutlined />} size="small">
              {displaySrc ? 'Đổi ảnh' : 'Chọn ảnh'}
            </Button>
          </Upload>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
            JPEG, PNG, WebP, GIF · tối đa 5 MB
          </div>
        </div>
      </div>

      {/* ─── Form fields ─── */}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: 'Nhập họ tên' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={isEditMode ? 24 : 14}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="example@email.com" disabled={isEditMode} />
            </Form.Item>
          </Col>
          {!isEditMode && (
            <Col span={10}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: 'Nhập mật khẩu' },
                  { min: 6, message: 'Tối thiểu 6 ký tự' },
                  { max: 64, message: 'Tối đa 64 ký tự' },
                ]}
              >
                <Input.Password placeholder="••••••" />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ max: 20, message: 'Tối đa 20 ký tự' }]}
            >
              <Input placeholder="0934..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Chọn vai trò' }]}
            >
              <Select options={ROLE_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Trạng thái" name="is_active" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Bị khoá" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
