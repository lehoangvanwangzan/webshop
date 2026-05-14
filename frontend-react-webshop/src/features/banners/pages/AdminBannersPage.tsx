import { useState } from 'react';
import {
  Table, Button, Tag, Popconfirm, App, Space, Row, Col, Card, Statistic,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageLayout } from '@shared/components/PageLayout';
import { useBanners, useDeleteBanner } from '../hooks/useBanners';
import { resolveBannerImageUrl } from '../api/banners.api';
import { BannerFormModal } from '../components/BannerFormModal';
import type { Banner } from '../types/banners.types';

/**
 * AdminBannersPage - Trang quản lý banners
 *
 * Features:
 * - Stats row: Tổng / Đang hiện / Tạm dừng
 * - Filter tabs: Tất cả / Trang chủ / Sidebar / Danh mục / Footer
 * - Table: STT | Ảnh | Tiêu đề/Link | Vị trí | Trạng thái | Thứ tự | Hành động
 * - Pagination với showSizeChanger
 * - Modal form cho tạo/chỉnh sửa
 *
 * @component
 */
export function AdminBannersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [positionFilter, setPositionFilter] = useState<string | undefined>(undefined);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined);

  const { message } = App.useApp();
  const { data, isLoading } = useBanners({
    page,
    limit: pageSize,
    position: positionFilter,
  });
  const deleteBanner = useDeleteBanner();

  // Compute stats từ fetched data
  const stats = data ? {
    total: data.total,
    active: data.items.filter(b => b.is_active).length,
    inactive: data.items.filter(b => !b.is_active).length,
  } : { total: 0, active: 0, inactive: 0 };

  const handleEdit = (record: Banner) => {
    setEditingBanner(record);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBanner.mutateAsync(id);
      message.success('Đã xoá banner');
    } catch {
      message.error('Xoá thất bại');
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingBanner(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingBanner(undefined);
  };

  const columns: ColumnsType<Banner> = [
    {
      title: 'STT',
      width: 60,
      align: 'center',
      render: (_: unknown, __: Banner, index: number) => (
        <span className="text-slate-400 text-xs">{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      title: 'Ảnh',
      width: 80,
      render: (_: unknown, record: Banner) => {
        return record.image_url ? (
          <img
            src={resolveBannerImageUrl(record.image_url)}
            alt={record.title}
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
      title: 'Tiêu đề / Đường dẫn',
      dataIndex: 'title',
      render: (title: string, record: Banner) => (
        <div>
          <div className="font-medium">{title}</div>
          {record.link_url && <div className="text-xs text-slate-400 truncate">{record.link_url}</div>}
        </div>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      width: 120,
      render: (position: string) => {
        const positionMap: Record<string, string> = {
          homepage: 'Trang chủ',
          sidebar: 'Sidebar',
          category: 'Danh mục',
          footer: 'Footer',
        };
        return positionMap[position] || position;
      },
    },
    {
      title: 'Trạng thái',
      width: 100,
      render: (_: unknown, record: Banner) => (
        <Tag color={record.is_active ? 'green' : 'red'}>
          {record.is_active ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sort_order',
      width: 80,
      align: 'center',
    },
    {
      title: 'Hành động',
      width: 100,
      fixed: 'right',
      render: (_: unknown, record: Banner) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xoá banner?"
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

  return (
    <PageLayout
      title="Quản lý banners"
      subtitle="Quản lý quảng cáo và hình ảnh banner"
      action={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => { setEditingBanner(undefined); setIsFormOpen(true); }}
        >
          Thêm banner
        </Button>
      }
    >

      {/* Stats row */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <Statistic title="Tổng banners" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <Statistic title="Đang hiển thị" value={stats.active} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <Statistic title="Đã ẩn" value={stats.inactive} valueStyle={{ color: '#dc2626' }} />
          </Card>
        </Col>
      </Row>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <Button
          type={positionFilter === undefined ? 'primary' : 'default'}
          onClick={() => { setPositionFilter(undefined); setPage(1); }}
        >
          Tất cả
        </Button>
        {['homepage', 'sidebar', 'category', 'footer'].map((pos) => (
          <Button
            key={pos}
            type={positionFilter === pos ? 'primary' : 'default'}
            onClick={() => { setPositionFilter(pos); setPage(1); }}
          >
            {pos === 'homepage' ? 'Trang chủ' : pos === 'sidebar' ? 'Sidebar' : pos === 'category' ? 'Danh mục' : 'Footer'}
          </Button>
        ))}
      </div>

      {/* Table */}
      <Table<Banner>
        rowKey="id"
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize,
          total: data?.total ?? 0,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
          showTotal: (total) => `Tổng ${total} banners`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      />

      {/* Modal form */}
      <BannerFormModal
        visible={isFormOpen}
        banner={editingBanner}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    </PageLayout>
  );
}
