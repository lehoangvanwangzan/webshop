import { useState, useEffect } from 'react';
import {
  Table, Button, Input, Select, Tag, Popconfirm, App, Space, Typography,
  Segmented, Pagination, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  AppstoreOutlined, BarsOutlined, PictureOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { COLORS } from '@shared/constants/colors';
import { PageLayout } from '@shared/components/PageLayout';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { resolveProductImageUrl } from '../api/products.api';
import { ProductForm } from '../components/ProductForm';
import type { Product } from '../types/products.types';

const { Text } = Typography;

export function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<number | undefined>(undefined);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const { message } = App.useApp();
  const deleteProduct = useDeleteProduct();

  const { data, isLoading } = useProducts({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    is_active: isActiveFilter,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct.mutateAsync(id);
      message.success('Đã xoá sản phẩm');
    } catch {
      message.error('Xoá thất bại. Vui lòng thử lại.');
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
    // invalidateQueries trong mutation tự động refetch, không cần gọi refetch() thủ công
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const PAGE_SIZE = 20;

  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      width: 72,
      fixed: 'left',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false,
      render: (_: unknown, __: Product, index: number) => (
        <span className="text-slate-400 text-xs">{(page - 1) * PAGE_SIZE + index + 1}</span>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 64,
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false,
      render: (id: number) => (
        <span className="text-xs font-mono text-slate-400">#{id}</span>
      ),
    },
    {
      title: 'Ảnh',
      width: 72,
      render: (_: unknown, record: Product) => {
        const primary = record.images?.[0];
        return primary ? (
          <img
            src={resolveProductImageUrl(primary.image_url)}
            alt={record.name}
            style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 8, border: '1px solid #f1f5f9' }}
          />
        ) : (
          <div style={{ width: 56, height: 42, borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PictureOutlined style={{ color: '#cbd5e1', fontSize: 18 }} />
          </div>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name, 'vi'),
      showSorterTooltip: false,
      render: (name: string) => (
        <Text strong style={{ fontSize: 13 }}>{name}</Text>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 140,
      sorter: (a, b) => a.sku.localeCompare(b.sku),
      showSorterTooltip: false,
      render: (sku: string) => (
        <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
          {sku}
        </code>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      width: 160,
      sorter: (a, b) => (a.category?.name ?? '').localeCompare(b.category?.name ?? '', 'vi'),
      showSorterTooltip: false,
      render: (name: string) => name ?? '—',
    },
    {
      title: 'Thương hiệu',
      dataIndex: ['brand', 'name'],
      width: 120,
      sorter: (a, b) => (a.brand?.name ?? '').localeCompare(b.brand?.name ?? '', 'vi'),
      showSorterTooltip: false,
      render: (name: string) => name ?? '—',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      width: 140,
      align: 'right',
      sorter: (a, b) => Number(a.price) - Number(b.price),
      showSorterTooltip: false,
      render: (price: number) => (
        <Text style={{ color: COLORS.primary, fontWeight: 600 }}>
          {Number(price).toLocaleString('vi-VN')}đ
        </Text>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      width: 90,
      align: 'center',
      sorter: (a, b) => a.stock - b.stock,
      showSorterTooltip: false,
      render: (stock: number) => (
        <span style={{ color: stock < 5 ? COLORS.primary : '#111827', fontWeight: stock < 5 ? 700 : 400 }}>
          {stock}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      width: 110,
      sorter: (a, b) => b.is_active - a.is_active,
      showSorterTooltip: false,
      render: (_: unknown, record: Product) => {
        const statusMap: Record<number, { label: string; color: string }> = {
          1: { label: 'Công khai', color: 'green' },
          2: { label: 'Bản nháp', color: 'default' },
          3: { label: 'Ẩn', color: 'red' },
        };
        const status = statusMap[record.is_active] || { label: `Mã ${record.is_active}`, color: 'blue' };
        return (
          <Space direction="vertical" size={2}>
            <Tag color={status.color} style={{ margin: 0 }}>
              {status.label}
            </Tag>
            {record.is_featured && (
              <Tag color="orange" style={{ margin: 0 }}>Nổi bật</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Hành động',
      width: 100,
      fixed: 'right',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xoá sản phẩm?"
            description="Hành động này không thể hoàn tác."
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isFormOpen) {
    return (
      <PageLayout
        title="Quản lý sản phẩm"
        subtitle={editingProduct ? `Chỉnh sửa: ${editingProduct.name}` : 'Thêm sản phẩm mới'}
      >
        <ProductForm
          initialValues={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Quản lý sản phẩm"
      subtitle="Quản lý danh mục sản phẩm"
      action={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: COLORS.primary, borderColor: COLORS.primary }}
          onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }}
        >
          Thêm sản phẩm
        </Button>
      }
    >

      <div className="flex gap-3 flex-wrap items-center">
        <Input.Search
          placeholder="Tìm theo tên hoặc SKU..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(v) => { setSearchText(v); setPage(1); }}
          allowClear
          style={{ width: 320 }}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 160 }}
          onChange={(v) => { setIsActiveFilter(v); setPage(1); }}
          options={[
            { label: 'Công khai', value: 1 },
            { label: 'Bản nháp', value: 2 },
            { label: 'Ẩn hiển thị', value: 3 },
          ]}
        />
        <Segmented
          className="ml-auto"
          value={viewMode}
          onChange={(v) => setViewMode(v as 'table' | 'card')}
          options={[
            { value: 'table', icon: <BarsOutlined />, label: 'Bảng' },
            { value: 'card', icon: <AppstoreOutlined />, label: 'Card' },
          ]}
        />
      </div>

      {viewMode === 'table' ? (
        <Table<Product>
          rowKey="id"
          columns={columns}
          dataSource={data?.items ?? []}
          loading={isLoading}
          scroll={{ x: 1160 }}
          pagination={{
            current: page,
            pageSize: 20,
            total: data?.total ?? 0,
            onChange: (p) => setPage(p),
            showTotal: (total) => `Tổng ${total} sản phẩm`,
            showSizeChanger: false,
          }}
          className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(data?.items ?? []).map((product) => {
              const statusMap: Record<number, { label: string; color: string }> = {
                1: { label: 'Công khai', color: 'green' },
                2: { label: 'Bản nháp', color: 'default' },
                3: { label: 'Ẩn', color: 'red' },
              };
              const status = statusMap[product.is_active] ?? { label: `Mã ${product.is_active}`, color: 'blue' };
              return (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:shadow-md hover:border-blue-200 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full bg-slate-50" style={{ paddingBottom: '75%' }}>
                    <div className="absolute inset-0">
                      {product.images?.[0] ? (
                        <img
                          src={resolveProductImageUrl(product.images[0].image_url)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <PictureOutlined style={{ fontSize: 40 }} />
                        </div>
                      )}
                    </div>
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      <Tooltip title="Chỉnh sửa">
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(product)}
                          className="bg-white border-none shadow"
                        />
                      </Tooltip>
                      <Popconfirm
                        title="Xoá sản phẩm?"
                        description="Hành động này không thể hoàn tác."
                        okText="Xoá"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(product.id)}
                      >
                        <Tooltip title="Xoá">
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            className="bg-white border-none shadow"
                          />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                    {/* Featured badge */}
                    {product.is_featured && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold bg-orange-400 text-white px-2 py-0.5 rounded-full z-20">
                        Nổi bật
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-1.5 p-3 flex-1">
                    <p
                      className="text-sm font-semibold text-slate-800 m-0 leading-tight"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {product.name}
                    </p>
                    <code className="text-[11px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded self-start">
                      {product.sku}
                    </code>
                    <div className="flex items-baseline gap-1.5 flex-wrap mt-auto pt-1">
                      <span className="text-sm font-bold" style={{ color: COLORS.primary }}>
                        {Number(product.price).toLocaleString('vi-VN')}đ
                      </span>
                      {product.discount_price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {Number(product.discount_price).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Tag color={status.color} style={{ margin: 0, fontSize: 11 }}>{status.label}</Tag>
                      <span className={`text-[11px] font-medium ${product.stock < 5 ? 'text-red-500' : 'text-slate-500'}`}>
                        Kho: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            current={page}
            pageSize={20}
            total={data?.total ?? 0}
            onChange={(p) => setPage(p)}
            showTotal={(total) => `Tổng ${total} sản phẩm`}
            showSizeChanger={false}
            className="text-center"
          />
        </>
      )}
    </PageLayout>
  );
}
