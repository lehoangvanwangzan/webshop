import { useState, useEffect } from 'react';
import {
  Table, Button, Input, Select, Tag, Popconfirm, App, Space, Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { COLORS } from '@shared/constants/colors';
import { PageLayout } from '@shared/components/PageLayout';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
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

  const { message } = App.useApp();
  const deleteProduct = useDeleteProduct();

  const { data, isLoading, refetch } = useProducts({
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
    refetch();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const columns: ColumnsType<Product> = [
    {
      title: '#',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      render: (name: string) => (
        <Text strong style={{ fontSize: 13 }}>{name}</Text>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 140,
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
      render: (name: string) => name ?? '—',
    },
    {
      title: 'Thương hiệu',
      dataIndex: ['brand', 'name'],
      width: 120,
      render: (name: string) => name ?? '—',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      width: 130,
      align: 'right',
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
      render: (stock: number) => (
        <span style={{ color: stock < 5 ? COLORS.primary : '#111827', fontWeight: stock < 5 ? 700 : 400 }}>
          {stock}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      width: 110,
      render: (_: unknown, record: Product) => {
        const statusMap: Record<number, { label: string; color: string }> = {
          1: { label: 'Công khai', color: 'green' },
          2: { label: 'Bản nháp', color: 'default' },
          0: { label: 'Ẩn', color: 'red' },
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

      <div className="flex gap-3 flex-wrap">
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
            { label: 'Ẩn hiển thị', value: 0 },
          ]}
        />
      </div>

      <Table<Product>
        rowKey="id"
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading}
        scroll={{ x: 1100 }}
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
    </PageLayout>
  );
}
