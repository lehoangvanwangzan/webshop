import { useEffect, useRef, useState } from 'react';
import {
  Form, Input, InputNumber, Select, Switch, App,
  Row, Col, Upload, Button, Card, Space,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, LoadingOutlined,
  ArrowLeftOutlined, SaveOutlined,
  TagOutlined, DollarOutlined, FileTextOutlined,
  PictureOutlined, SendOutlined, BarcodeOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useCategoriesFlat, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../categories/hooks/useCategories';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '../../brands/hooks/useBrands';
import { CrudSelect } from '../../../shared/components/CrudSelect';
import { slugify } from '../../../shared/utils/slugify';
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

/* ── Shared card section header ── */
function SectionHeader({
  icon,
  title,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        <span className="font-bold text-slate-800 text-sm">{title}</span>
      </div>
      {extra}
    </div>
  );
}

/* ── Image slot types ── */
type SavedEntry = { type: 'saved'; img: ProductImage; url: string };
type PendingEntry = { type: 'pending'; url: string; index: number };
type ImageEntry = SavedEntry | PendingEntry;

export function ProductForm({ initialValues, onSuccess, onCancel }: Props) {
  const [form] = Form.useForm<CreateProductPayload>();
  const { message } = App.useApp();
  const slugManuallyEdited = useRef(false);
  const isEditMode = !!initialValues?.id;

  /* ── Image state ── */
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  /* ── Price warning state ── */
  const [priceValue, setPriceValue] = useState<number | null>(null);
  const [discountValue, setDiscountValue] = useState<number | null>(null);

  const { data: categories = [] } = useCategoriesFlat();
  const { data: brands = [] } = useBrands();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const { data: savedImages = [], isLoading: imagesLoading } =
    useProductImages(isEditMode ? initialValues?.id : undefined);
  const uploadImages = useUploadProductImages(initialValues?.id);
  const deleteImage = useDeleteProductImage(initialValues?.id);

  /* Merge saved + pending into one list */
  const allImages: ImageEntry[] = [
    ...savedImages.map((img): SavedEntry => ({
      type: 'saved',
      img,
      url: resolveProductImageUrl(img.image_url),
    })),
    ...previewUrls.map((url, index): PendingEntry => ({ type: 'pending', url, index })),
  ];
  const totalImages = allImages.length;
  const canAddMore = totalImages < MAX_IMAGES;

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  const brandOptions = brands.map((b) => ({ id: b.id, name: b.name, slug: b.slug }));
  const crudLoading =
    createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;
  const brandCrudLoading =
    createBrand.isPending || updateBrand.isPending || deleteBrand.isPending;

  /* ── Init form on mount / id change ── */
  useEffect(() => {
    slugManuallyEdited.current = false;
    setPendingFiles([]);
    setPreviewUrls([]);

    if (initialValues) {
      const price = Number(initialValues.price) || null;
      const discount = initialValues.discount_price ? Number(initialValues.discount_price) : null;
      setPriceValue(price);
      setDiscountValue(discount);
      form.setFieldsValue({
        name: initialValues.name,
        slug: initialValues.slug,
        sku: initialValues.sku,
        short_description: initialValues.short_description,
        description: initialValues.description,
        price: price as unknown as number,
        discount_price: discount as unknown as number,
        stock: initialValues.stock,
        category_id: initialValues.category_id,
        brand_id: initialValues.brand_id,
        is_active: initialValues.is_active ?? 1,
        is_featured: initialValues.is_featured,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ is_active: 1, is_featured: false, stock: 0 });
      setPriceValue(null);
      setDiscountValue(null);
    }
  }, [initialValues, form]);

  /* Cleanup blob URLs on unmount */
  useEffect(
    () => () => { previewUrls.forEach((u) => URL.revokeObjectURL(u)); },
    [previewUrls],
  );

  /* ── Handlers ── */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode && !slugManuallyEdited.current) {
      form.setFieldValue('slug', slugify(e.target.value));
    }
  };

  const handleFileSelect: UploadProps['beforeUpload'] = (file) => {
    if (totalImages >= MAX_IMAGES) {
      message.warning(`Tối đa ${MAX_IMAGES} ảnh cho một sản phẩm`);
      return false;
    }
    setPendingFiles((prev) => [...prev, file as File]);
    setPreviewUrls((prev) => [...prev, URL.createObjectURL(file as File)]);
    return false;
  };

  const removePending = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteSaved = async (img: ProductImage) => {
    try {
      await deleteImage.mutateAsync(img.id);
      message.success('Đã xoá ảnh');
    } catch {
      message.error('Xoá ảnh thất bại');
    }
  };

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
  const discountWarning =
    discountValue !== null && priceValue !== null && discountValue >= priceValue;

  /* ── Image slot renderer ── */
  const renderImageSlot = (entry: ImageEntry, isPrimary: boolean, key: string) => {
    const isPending = entry.type === 'pending';
    const borderCls = isPending ? 'border-amber-300' : isPrimary ? 'border-blue-200' : 'border-slate-200';
    const wrapCls = isPrimary
      ? `relative w-full overflow-hidden rounded-xl border-2 group ${borderCls}`
      : `relative w-full aspect-square overflow-hidden rounded-xl border-2 group ${borderCls}`;

    const handleDelete = () => {
      if (isPending) removePending((entry as PendingEntry).index);
      else handleDeleteSaved((entry as SavedEntry).img);
    };

    return (
      <div key={key} className={wrapCls} style={isPrimary ? { paddingBottom: '75%' } : {}}>
        <img
          src={entry.url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {isPrimary && !isPending && (
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full z-10">
            Đại diện
          </span>
        )}
        {isPending && (
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full z-10">
            Chờ lưu
          </span>
        )}
        <button
          type="button"
          onClick={handleDelete}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-20"
        >
          <DeleteOutlined className={isPrimary ? 'text-2xl' : 'text-base'} />
        </button>
      </div>
    );
  };

  const primaryEntry = allImages[0] ?? null;
  const secondaryList = allImages.slice(1);

  /* ═══════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════ */
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>

      {/* ── Sticky action header ── */}
      <div className="flex items-center justify-between mb-6 py-3 sticky top-0 z-30 bg-white border-b border-slate-100">
        <Space size={12}>
          <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
            Quay lại
          </Button>
          <h2 className="text-lg font-bold text-slate-800 m-0">
            {isEditMode ? `Chỉnh sửa sản phẩm` : 'Thêm sản phẩm mới'}
          </h2>
        </Space>
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isLoading}
            onClick={() => form.submit()}
            className="bg-blue-600 border-none shadow-md shadow-blue-200"
          >
            {isEditMode ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
          </Button>
        </Space>
      </div>

      {/* ── 2-column layout ── */}
      <Row gutter={24} align="top">

        {/* ════════════════════════
            LEFT COLUMN  (16 / 24)
        ════════════════════════ */}
        <Col xs={24} lg={16}>
          <div className="space-y-5">

            {/* ── Card: Thông tin cơ bản ── */}
            <Card className="rounded-2xl border border-slate-100 shadow-sm" styles={{ body: { padding: 24 } }}>
              <SectionHeader icon={<TagOutlined />} title="Thông tin cơ bản" />

              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input
                  size="large"
                  placeholder="VD: Ubiquiti UniFi AP-AC-Pro"
                  onChange={handleNameChange}
                  className="rounded-xl"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Danh mục"
                    name="category_id"
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                  >
                    <CrudSelect
                      options={categoryOptions}
                      placeholder="Chọn danh mục..."
                      loading={crudLoading}
                      onCreate={async (name, slug) => {
                        await createCategory.mutateAsync({ name, slug, is_active: true });
                      }}
                      onEdit={async (id, name, slug) => {
                        await updateCategory.mutateAsync({ id, payload: { name, slug } });
                      }}
                      onDelete={async (id) => {
                        await deleteCategory.mutateAsync(id);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Thương hiệu" name="brand_id">
                    <CrudSelect
                      options={brandOptions}
                      placeholder="Chọn thương hiệu..."
                      allowClear
                      loading={brandCrudLoading}
                      onCreate={async (name, slug) => {
                        await createBrand.mutateAsync({ name, slug, is_active: true });
                      }}
                      onEdit={async (id, name, slug) => {
                        await updateBrand.mutateAsync({ id, payload: { name, slug } });
                      }}
                      onDelete={async (id) => {
                        await deleteBrand.mutateAsync(id);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="SKU"
                name="sku"
                rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
                extra={<span className="text-xs text-slate-400">Mã hàng hoá duy nhất, không được trùng</span>}
              >
                <Input
                  prefix={<BarcodeOutlined className="text-slate-400" />}
                  placeholder="VD: UBI-UAP-AC-PRO"
                  className="rounded-xl font-mono"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-slate-600 text-xs">
                    Slug URL
                    {!isEditMode && (
                      <span className="ml-2 text-slate-400 font-normal">· Tự động tạo từ tên</span>
                    )}
                  </span>
                }
                name="slug"
                rules={[{ required: true, message: 'Slug không được trống' }]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  addonBefore={<span className="text-slate-400 text-xs select-none">/san-pham/</span>}
                  placeholder="ubiquiti-unifi-ap-ac-pro"
                  onChange={() => { if (!isEditMode) slugManuallyEdited.current = true; }}
                  className="text-slate-500"
                />
              </Form.Item>
            </Card>

            {/* ── Card: Giá & Tồn kho ── */}
            <Card className="rounded-2xl border border-slate-100 shadow-sm" styles={{ body: { padding: 24 } }}>
              <SectionHeader icon={<DollarOutlined />} title="Giá & Tồn kho" />

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Giá bán"
                    name="price"
                    rules={[{ required: true, message: 'Nhập giá bán' }]}
                  >
                    <InputNumber
                      size="large"
                      className="w-full"
                      min={0}
                      addonAfter="đ"
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(v) => Number(v?.replace(/,/g, '') ?? 0) as unknown as 0}
                      placeholder="1,920,000"
                      onChange={(v) => setPriceValue(v as number | null)}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Giá khuyến mãi"
                    name="discount_price"
                    validateStatus={discountWarning ? 'warning' : undefined}
                    extra={
                      discountWarning
                        ? <span className="text-amber-500 text-xs">⚠ Nên nhỏ hơn giá bán</span>
                        : <span className="text-slate-400 text-xs">Để trống nếu không KM</span>
                    }
                  >
                    <InputNumber
                      size="large"
                      className="w-full"
                      min={0}
                      addonAfter="đ"
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(v) => Number(v?.replace(/,/g, '') ?? 0) as unknown as 0}
                      placeholder="Không bắt buộc"
                      onChange={(v) => setDiscountValue(v as number | null)}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Tồn kho"
                    name="stock"
                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                  >
                    <InputNumber
                      size="large"
                      className="w-full"
                      min={0}
                      addonAfter="cái"
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* ── Card: Mô tả sản phẩm ── */}
            <Card className="rounded-2xl border border-slate-100 shadow-sm" styles={{ body: { padding: 24 } }}>
              <SectionHeader icon={<FileTextOutlined />} title="Mô tả sản phẩm" />

              <Form.Item label="Mô tả ngắn" name="short_description">
                <Input.TextArea
                  rows={3}
                  placeholder="Tóm tắt ngắn gọn về tính năng nổi bật của sản phẩm..."
                  showCount
                  maxLength={500}
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item label="Mô tả chi tiết" name="description" style={{ marginBottom: 0 }}>
                <RichTextEditor placeholder="Mô tả đầy đủ về sản phẩm..." />
              </Form.Item>
            </Card>

          </div>
        </Col>

        {/* ════════════════════════
            RIGHT COLUMN (8 / 24)
        ════════════════════════ */}
        <Col xs={24} lg={8}>
          <div className="space-y-5">

            {/* ── Card: Hình ảnh sản phẩm ── */}
            <Card
              className="rounded-2xl border border-slate-100 shadow-sm"
              styles={{ body: { padding: 20 } }}
            >
              <SectionHeader
                icon={<PictureOutlined />}
                title="Hình ảnh sản phẩm"
                extra={
                  <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                    {totalImages}/{MAX_IMAGES}
                  </span>
                }
              />

              {imagesLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                  <LoadingOutlined className="text-2xl" />
                  <span className="text-sm">Đang tải ảnh…</span>
                </div>
              ) : (
                <div className="space-y-3">

                  {/* Primary image slot */}
                  <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                    <div className="absolute inset-0">
                      {primaryEntry ? (
                        renderImageSlot(primaryEntry, true, `primary-${primaryEntry.url}`)
                      ) : (
                        canAddMore && (
                          <Upload
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            showUploadList={false}
                            multiple
                            beforeUpload={handleFileSelect}
                          >
                            <div
                              className="w-full h-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 transition-all"
                              style={{ minHeight: 160 }}
                            >
                              <CameraOutlined className="text-4xl" />
                              <span className="text-sm font-medium">Ảnh đại diện</span>
                              <span className="text-xs opacity-60">Nhấn để tải ảnh lên</span>
                            </div>
                          </Upload>
                        )
                      )}
                    </div>
                  </div>

                  {/* Secondary images grid (slots 1–8) */}
                  {(secondaryList.length > 0 || (canAddMore && primaryEntry !== null)) && (
                    <div className="grid grid-cols-3 gap-2">
                      {secondaryList.map((entry, idx) =>
                        renderImageSlot(entry, false, `sec-${entry.url}-${idx}`)
                      )}

                      {/* Add-more button — only show when primary exists and slots remain */}
                      {canAddMore && primaryEntry !== null && (
                        <Upload
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          showUploadList={false}
                          multiple
                          beforeUpload={handleFileSelect}
                        >
                          <div className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 transition-all">
                            <PlusOutlined className="text-lg" />
                            <span className="text-[11px]">Thêm ảnh</span>
                          </div>
                        </Upload>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    JPG, PNG, WebP · Tối đa 5 MB/ảnh · Tối đa {MAX_IMAGES} hình
                  </p>
                </div>
              )}
            </Card>

            {/* ── Card: Xuất bản ── */}
            <Card className="rounded-2xl border border-slate-100 shadow-sm" styles={{ body: { padding: 20 } }}>
              <SectionHeader icon={<SendOutlined />} title="Xuất bản" />

              <Form.Item label="Trạng thái hiển thị" name="is_active" style={{ marginBottom: 16 }}>
                <Select size="large">
                  <Select.Option value={1}>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                      Công khai
                    </span>
                  </Select.Option>
                  <Select.Option value={2}>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
                      Bản nháp
                    </span>
                  </Select.Option>
                  <Select.Option value={3}>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                      Ẩn hiển thị
                    </span>
                  </Select.Option>
                </Select>
              </Form.Item>

              <div className="flex items-start justify-between gap-3 bg-slate-50 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-slate-700 m-0">Sản phẩm nổi bật</p>
                  <p className="text-xs text-slate-400 m-0 mt-0.5">Hiển thị ở trang chủ & danh sách ưu tiên</p>
                </div>
                <Form.Item name="is_featured" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </Card>

            {/* ── Save button (bottom) ── */}
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              loading={isLoading}
              onClick={() => form.submit()}
              block
              className="bg-blue-600 border-none shadow-lg shadow-blue-200 rounded-xl"
              style={{ height: 44 }}
            >
              {isEditMode ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </Button>

          </div>
        </Col>

      </Row>
    </Form>
  );
}
