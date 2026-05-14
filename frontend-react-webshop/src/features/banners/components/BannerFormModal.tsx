import { useEffect, useState } from 'react';
import {
  Form, Input, InputNumber, Select, Modal, Button, Upload, App,
} from 'antd';
import type { UploadProps } from 'antd';
import { useCreateBanner, useUpdateBanner, useUploadBannerImage } from '../hooks/useBanners';
import { bannersApi, resolveBannerImageUrl } from '../api/banners.api';
import type { Banner, CreateBannerPayload } from '../types/banners.types';

interface Props {
  visible: boolean;
  banner?: Banner;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * BannerFormModal - Modal form cho tạo/chỉnh sửa banner
 *
 * Features:
 * - Form fields: title, position, sort_order, link_url, image upload
 * - Image preview display
 * - Loading state từ mutations
 * - Auto-invalidate cache after success
 *
 * @component
 * @param visible - Modal visibility state
 * @param banner - Banner to edit (undefined for create)
 * @param onSuccess - Callback khi form submit thành công
 * @param onCancel - Callback khi click Cancel
 */
export function BannerFormModal({ visible, banner, onSuccess, onCancel }: Props) {
  const [form] = Form.useForm<CreateBannerPayload>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { message } = App.useApp();

  const isEditMode = !!banner?.id;
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const uploadImage = useUploadBannerImage(banner?.id!);

  const positionOptions = [
    { label: 'Trang chủ', value: 'homepage' },
    { label: 'Sidebar', value: 'sidebar' },
    { label: 'Danh mục', value: 'category' },
    { label: 'Footer', value: 'footer' },
  ];

  // Initialize form when modal opens
  useEffect(() => {
    if (visible) {
      if (isEditMode && banner) {
        form.setFieldsValue({
          title: banner.title,
          position: banner.position,
          sort_order: banner.sort_order,
          link_url: banner.link_url || undefined,
        });
        if (banner.image_url) {
          setPreviewUrl(resolveBannerImageUrl(banner.image_url));
        }
      } else {
        form.resetFields();
        setImageFile(null);
        setPreviewUrl('');
      }
    }
  }, [visible, banner, form, isEditMode]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageSelect: UploadProps['beforeUpload'] = (file) => {
    setImageFile(file as File);
    const url = URL.createObjectURL(file as File);
    setPreviewUrl(url);
    return false;
  };

  const handleSubmit = async (values: CreateBannerPayload) => {
    try {
      if (isEditMode) {
        await updateBanner.mutateAsync({ id: banner!.id, payload: values });
        if (imageFile) {
          await uploadImage.mutateAsync(imageFile);
        }
        message.success('Cập nhật banner thành công');
      } else {
        if (!imageFile) {
          message.error('Vui lòng chọn ảnh banner');
          return;
        }
        const created = await createBanner.mutateAsync(values);
        await bannersApi.uploadImage(created.id, imageFile);
        message.success('Thêm banner thành công');
      }
      onSuccess();
    } catch (error) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Có lỗi xảy ra';
      message.error(msg);
    }
  };

  const isLoading = createBanner.isPending || updateBanner.isPending || uploadImage.isPending;

  return (
    <Modal
      title={isEditMode ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>Hủy</Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={() => form.submit()}
        >
          {isEditMode ? 'Lưu' : 'Thêm'}
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="VD: Ưu đãi mùa hè..." size="large" />
        </Form.Item>

        <Form.Item
          label="Vị trí"
          name="position"
          rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
        >
          <Select placeholder="Chọn vị trí..." size="large" options={positionOptions} />
        </Form.Item>

        <Form.Item label="Thứ tự" name="sort_order">
          <InputNumber min={0} placeholder="0" size="large" />
        </Form.Item>

        <Form.Item
          label="Đường dẫn (Tùy chọn)"
          name="link_url"
        >
          <Input placeholder="https://..." size="large" allowClear />
        </Form.Item>

        <Form.Item
          label="Ảnh banner"
          required={!isEditMode}
        >
          <Upload.Dragger
            name="image"
            accept="image/*"
            multiple={false}
            beforeUpload={handleImageSelect}
          >
            <p className="ant-upload-drag-icon">🖼️</p>
            <p>Kéo ảnh vào hoặc nhấp để chọn</p>
            <p className="ant-upload-hint">JPG, PNG, WebP · Tối đa 5 MB</p>
          </Upload.Dragger>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', marginTop: 12, borderRadius: 8 }}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
