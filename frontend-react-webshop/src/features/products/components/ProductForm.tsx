import { useEffect, useRef, useState } from 'react';
import {
  Form, Input, InputNumber, Select, Switch, App,
  Row, Col, Upload, Button, Card, Space,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, LoadingOutlined,
  ArrowLeftOutlined, SaveOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useCategories } from '../../categories/hooks/useCategories';
import { useBrands } from '../../brands/hooks/useBrands';
import {
  useCreateProduct, useUpdateProduct,
  useProductImages, useUploadProductImages, useDeleteProductImage,
} from '../hooks/useProducts';
import { resolveProductImageUrl, productsApi } from '../api/products.api';
import type { Product, ProductImage, CreateProductPayload } from '../types/products.types';
import { RichTextEditor } from '../../../shared/components/RichTextEditor';

const MAX_IMAGES = 9;

interface Props {
  initialValues?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export function ProductForm({ initialValues, onSuccess, onCancel }: Props) {
  const [form] = Form.useForm<CreateProductPayload>();
  const { message } = App.useApp();
  const slugManuallyEdited = useRef(false);
  const isEditMode = !!initialValues?.id;

  /* ── Image state ── */
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls]   = useState<string[]>([]);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] }     = useBrands();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { data: savedImages = [], isLoading: imagesLoading } =
    useProductImages(isEditMode ? initialValues?.id : undefined);
  const uploadImages = useUploadProductImages(initialValues?.id);
  const deleteImage  = useDeleteProductImage(initialValues?.id);

  const totalImages = savedImages.length + pendingFiles.length;
  const canAddMore  = totalImages < MAX_IMAGES;

  const flatCategories = categories.flatMap((cat) => [
    { label: cat.name, value: cat.id },
    ...(cat.children ?? []).map((child) => ({
      label: `  └ ${child.name}`,
      value: child.id,
    })),
  ]);

  const brandOptions = brands.map((b) => ({ label: b.name, value: b.id }));

  /* Reset khi vào trang/thay đổi id */
  useEffect(() => {
    slugManuallyEdited.current = false;
    setPendingFiles([]);
    setPreviewUrls([]);

    if (initialValues) {
      form.setFieldsValue({
        name:              initialValues.name,
        slug:              initialValues.slug,
        sku:               initialValues.sku,
        short_description: initialValues.short_description,
        description:       initialValues.description,
        price:             initialValues.price,
        discount_price:    initialValues.discount_price,
        stock:             initialValues.stock,
        category_id:       initialValues.category_id,
        brand_id:          initialValues.brand_id,
        is_active:         initialValues.is_active !== undefined ? initialValues.is_active : 1,
        is_featured:       initialValues.is_featured,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ is_active: 1, is_featured: false, stock: 0 });
    }
  }, [initialValues, form]);

  /* Cleanup object URLs khi unmount */
  useEffect(
    () => () => { previewUrls.forEach((u) => URL.revokeObjectURL(u)); },
    [previewUrls],
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode && !slugManuallyEdited.current) {
      form.setFieldValue('slug', slugify(e.target.value));
    }
  };

  /* Image handlers */
  const handleFileSelect: UploadProps['beforeUpload'] = (file) => {
    if (totalImages >= MAX_IMAGES) {
      message.warning(`Tối đa ${MAX_IMAGES} ảnh cho một sản phẩm`);
      return Upload.LIST_IGNORE;
    }
    setPendingFiles((prev) => [...prev, file as File]);
    setPreviewUrls((prev) => [...prev, URL.createObjectURL(file as File)]);
    return false;
  };

  const removePending = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev)  => prev.filter((_, i) => i !== index));
  };

  const handleDeleteSaved = async (img: ProductImage) => {
    try {
      await deleteImage.mutateAsync(img.id);
      message.success('Đã xoá ảnh');
    } catch {
      message.error('Xoá ảnh thất bại');
    }
  };

  /* Form submit */
  const handleSubmit = async (values: CreateProductPayload) => {
    try {
      if (isEditMode) {
        await updateProduct.mutateAsync({ id: initialValues!.id, payload: values });
        if (pendingFiles.length > 0) await uploadImages.mutateAsync(pendingFiles);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        const created = await createProduct.mutateAsync(values);
        if (pendingFiles.length > 0) {
          await productsApi.uploadImages(created.id, pendingFiles);
        }
        message.success('Thêm sản phẩm thành công');
      }
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Có lỗi xảy ra. Vui lòng thử lại.';
      message.error(msg);
    }
  };

  const isLoading = createProduct.isPending || updateProduct.isPending || uploadImages.isPending;

  return (
    <div className="space-y-6">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <Space size={12}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={onCancel}
            className="flex items-center justify-center hover:text-blue-600 transition-colors"
          >
            Quay lại
          </Button>
          <h2 className="text-xl font-bold text-slate-800 m-0">
            {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
        </Space>

        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isLoading}
            onClick={() => form.submit()}
            className="bg-blue-600 shadow-lg shadow-blue-200"
          >
            {isEditMode ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
          </Button>
        </Space>
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
                <Input size="large" placeholder="Tên sản phẩm" onChange={handleNameChange} className="rounded-xl" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="SKU" name="sku" rules={[{ required: true, message: 'Nhập SKU' }]}>
                <Input size="large" placeholder="VD: MKT-RB750GR3" className="rounded-xl" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Slug (URL)" name="slug" rules={[{ required: true, message: 'Nhập slug' }]}>
            <Input
              placeholder="ten-san-pham"
              onChange={() => { if (!isEditMode) slugManuallyEdited.current = true; }}
              className="rounded-xl"
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                <Select
                  size="large"
                  placeholder="Chọn danh mục"
                  options={flatCategories}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thương hiệu" name="brand_id">
                <Select
                  size="large"
                  placeholder="Chọn thương hiệu"
                  options={brandOptions}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="Giá bán (đ)" name="price" rules={[{ required: true, message: 'Nhập giá bán' }]}>
                <InputNumber
                  size="large"
                  className="w-full rounded-xl" 
                  min={0}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="1,920,000"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giá khuyến mãi (đ)" name="discount_price">
                <InputNumber
                  size="large"
                  className="w-full rounded-xl" 
                  min={0}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="Không bắt buộc"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tồn kho" name="stock" rules={[{ required: true, message: 'Nhập tồn kho' }]}>
                <InputNumber size="large" className="w-full rounded-xl" min={0} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả ngắn" name="short_description">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn gọn về sản phẩm" className="rounded-xl" />
          </Form.Item>

          <Form.Item label="Mô tả chi tiết" name="description">
            <RichTextEditor placeholder="Mô tả đầy đủ về sản phẩm..." />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Trạng thái hiển thị" name="is_active">
                <Select size="large" className="rounded-xl">
                  <Select.Option value={1}>Công khai</Select.Option>
                  <Select.Option value={2}>Bản nháp</Select.Option>
                  <Select.Option value={0}>Ẩn hiển thị</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Sản phẩm nổi bật" name="is_featured" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {/* ── Hình ảnh ── */}
          <Form.Item
            label={
              <span className="font-semibold text-slate-700">
                Hình ảnh sản phẩm&nbsp;
                <span className="text-slate-400 font-normal text-xs">
                  ({totalImages}/{MAX_IMAGES})
                </span>
              </span>
            }
          >
            {imagesLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <LoadingOutlined /> Đang tải ảnh…
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {savedImages.map((img) => (
                  <div key={img.id} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group shadow-sm">
                    <img src={resolveProductImageUrl(img.image_url)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(img)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <DeleteOutlined className="text-xl" />
                    </button>
                    {img.sort_order === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold bg-blue-600 text-white py-1">
                        Đại diện
                      </span>
                    )}
                  </div>
                ))}

                {previewUrls.map((url, i) => (
                  <div key={url} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-blue-300 group shadow-sm">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePending(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <DeleteOutlined className="text-xl" />
                    </button>
                    <span className="absolute top-0 left-0 right-0 text-center text-[10px] font-bold bg-amber-400 text-white py-1">
                      Chờ lưu
                    </span>
                  </div>
                ))}

                {canAddMore && (
                  <Upload
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    showUploadList={false}
                    multiple
                    beforeUpload={handleFileSelect}
                  >
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-slate-400 hover:text-blue-600 group">
                      <PlusOutlined className="text-2xl group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium">Thêm ảnh</span>
                    </div>
                  </Upload>
                )}
              </div>
            )}
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              JPG, PNG, WebP · Tối đa 5MB · Tối đa {MAX_IMAGES} hình ảnh
            </p>
          </Form.Item>
        </Form>
      </Card>

      <div className="flex justify-end gap-3 pb-10">
        <Button size="large" onClick={onCancel} className="px-8 rounded-xl">Hủy bỏ</Button>
        <Button
          type="primary"
          size="large"
          icon={<SaveOutlined />}
          loading={isLoading}
          onClick={() => form.submit()}
          className="bg-blue-600 px-8 rounded-xl shadow-lg shadow-blue-200 border-none"
        >
          {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </Button>
      </div>
    </div>
  );
}
