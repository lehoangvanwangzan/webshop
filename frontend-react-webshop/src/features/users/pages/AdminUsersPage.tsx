import { useState, useEffect } from 'react';
import { Table, Input, Select, Tag, Popconfirm, App, Space, Avatar, Typography, Button } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined, KeyOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import { COLORS } from '@shared/constants/colors';
import { PageLayout } from '@shared/components/PageLayout';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import { UserEditModal } from '../components/UserEditModal';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { resolveAvatarUrl } from '../api/users.api';
import type { AdminUser, UserRole, UserQueryParams } from '../types/users.types';

const { Text } = Typography;

const ROLE_COLOR: Record<UserRole, string> = {
  admin: 'red',
  staff: 'blue',
  customer: 'default',
};

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  staff: 'Nhân viên',
  customer: 'Khách hàng',
};

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<UserQueryParams['sort_by']>('created_at');
  const [sortOrder, setSortOrder] = useState<UserQueryParams['sort_order']>('DESC');
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [changePwdUser, setChangePwdUser] = useState<AdminUser | undefined>(undefined);

  const { message } = App.useApp();
  const deleteUser = useDeleteUser();

  const { data, isLoading } = useUsers({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    role: roleFilter,
    is_active: isActiveFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: number) => {
    try {
      await deleteUser.mutateAsync(id);
      message.success('Đã xoá người dùng');
    } catch {
      message.error('Xoá thất bại. Vui lòng thử lại.');
    }
  };

  /** Xử lý khi click header để sort */
  const handleTableChange: TableProps<AdminUser>['onChange'] = (_pagination, _filters, sorter) => {
    const s = sorter as SorterResult<AdminUser>;
    if (s.columnKey && s.order) {
      setSortBy(s.columnKey as UserQueryParams['sort_by']);
      setSortOrder(s.order === 'ascend' ? 'ASC' : 'DESC');
    } else {
      // Bỏ sort → về mặc định
      setSortBy('created_at');
      setSortOrder('DESC');
    }
    setPage(1);
  };

  const PAGE_SIZE = pageSize;

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'STT',
      key: 'id',
      width: 72,
      fixed: 'left',
      align: 'center',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (_: unknown, __: AdminUser, index: number) => (
        <span className="text-slate-400 text-xs">{(page - 1) * PAGE_SIZE + index + 1}</span>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 68,
      align: 'center',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (id: number) => (
        <span className="text-xs font-mono text-slate-400">#{id}</span>
      ),
    },
    {
      title: 'Người dùng',
      key: 'full_name',
      width: 400,
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      showSorterTooltip: false,
      render: (_: unknown, record: AdminUser) => (
        <Space size={8}>
          <Avatar
            size={28}
            src={resolveAvatarUrl(record.avatar_url)}
            icon={!record.avatar_url ? <UserOutlined /> : undefined}
            style={{ background: COLORS.primary, flexShrink: 0 }}
          />
          <div>
            <Text strong style={{ fontSize: 12 }}>{record.full_name}</Text>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      width: 130,
      render: (phone: string) => phone ?? '—',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (role: UserRole) => (
        <Tag color={ROLE_COLOR[role]}>{ROLE_LABEL[role]}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 120,
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'Hoạt động' : 'Bị khoá'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'descend',
      render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: AdminUser) => (
        <Space>
          <EditOutlined
            style={{ cursor: 'pointer', color: '#6b7280', fontSize: 16 }}
            onClick={() => { setEditingUser(record); setModalOpen(true); }}
          />
          <KeyOutlined
            style={{ cursor: 'pointer', color: '#f59e0b', fontSize: 16 }}
            onClick={() => setChangePwdUser(record)}
          />
          <Popconfirm
            title="Xoá người dùng?"
            description="Hành động này không thể hoàn tác."
            okText="Xoá"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined style={{ cursor: 'pointer', color: COLORS.primary, fontSize: 16 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageLayout
      title="Quản lý người dùng"
      subtitle="Quản lý tài khoản người dùng"
      action={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: COLORS.primary, borderColor: COLORS.primary }}
          onClick={() => { setEditingUser(undefined); setModalOpen(true); }}
        >
          Thêm người dùng
        </Button>
      }
    >

      <div className="flex gap-3 flex-wrap">
        <Input.Search
          placeholder="Tìm theo tên, email, SĐT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder="Vai trò"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => { setRoleFilter(v); setPage(1); }}
          options={[
            { label: 'Admin', value: 'admin' },
            { label: 'Nhân viên', value: 'staff' },
            { label: 'Khách hàng', value: 'customer' },
          ]}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => { setIsActiveFilter(v); setPage(1); }}
          options={[
            { label: 'Hoạt động', value: true },
            { label: 'Bị khoá', value: false },
          ]}
        />
      </div>

      <Table<AdminUser>
        rowKey="id"
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading}
        scroll={{ x: 900 }}
        onChange={handleTableChange}
        showSorterTooltip={{ target: 'sorter-icon' }}
        pagination={{
          current: page,
          pageSize,
          total: data?.total ?? 0,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
          showTotal: (total) => `Tổng ${total} người dùng`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      />

      <UserEditModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingUser(undefined); }}
        user={editingUser}
      />

      <ChangePasswordModal
        open={!!changePwdUser}
        onClose={() => setChangePwdUser(undefined)}
        user={changePwdUser}
      />
    </PageLayout>
  );
}
