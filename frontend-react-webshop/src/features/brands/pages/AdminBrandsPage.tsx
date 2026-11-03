import { useState } from 'react';
import {
  Table, Button, Space, Tag, Popconfirm, App, Modal, Form, Input,
  InputNumber, Switch,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageLayout } from '@shared/components/PageLayout';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '../hooks/useBrands';
import type { Brand } from '../types/brands.types';

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');
}

export function AdminBrandsPage() {
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (brand: Brand) => {
    setEditing(brand);
    form.setFieldsValue({ ...brand });
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateBrand.mutateAsync({ id: editing.id, payload: values });
        message.success('Đã cập nhật thương hiệu');
      } else {
        await createBrand.mutateAsync(values);
        message.success('Đã thêm thương hiệu');
      }
      setModalOpen(false);
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? 'Lỗi, thử lại');
    }
  };

  const handleDelete = async (id: number) => {
    try { await deleteBrand.mutateAsync(id); message.success('Đã xoá'); }
    catch { message.error('Xoá thất bại'); }
  };

  const columns: ColumnsType<Brand> = [
    { title: 'ID', dataIndex: 'id', width: 64, align: 'center', render: (id) => <span className="text-xs text-slate-400">#{id}</span> },
    {
      title: 'Logo', dataIndex: 'logo_url', width: 72,
      render: (url) => url
        ? <img src={url} alt="logo" style={{ width: 48, height: 36, objectFit: 'contain', borderRadius: 4, background: '#f8fafc', border: '1px solid #f1f5f9' }} />
        : <div style={{ width: 48, height: 36, background: '#f1f5f9', borderRadius: 4 }} />,
    },
    { title: 'Tên', dataIndex: 'name', render: (name) => <strong>{name}</strong> },
    { title: 'Slug', dataIndex: 'slug', render: (s) => <code className="text-xs bg-slate-100 px-1 rounded">{s}</code> },
    {
      title: 'Website', dataIndex: 'website_url', width: 180,
      render: (url) => url
        ? <a href={url} target="_blank" rel="noreferrer" className="text-blue-500 text-xs flex items-center gap-1"><LinkOutlined />{url.replace(/^https?:\/\//, '')}</a>
        : '—',
    },
    { title: 'Thứ tự', dataIndex: 'sort_order', width: 90, align: 'center' },
    {
      title: 'Trạng thái', dataIndex: 'is_active', width: 110, align: 'center',
      render: (v) => <Tag color={v ? 'green' : 'default'}>{v ? 'Hiển thị' : 'Ẩn'}</Tag>,
    },
    {
      title: 'Hành động', width: 110, align: 'center',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Xoá thương hiệu?" okText="Xoá" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageLayout
      title="Quản lý thương hiệu"
      subtitle="Danh sách thương hiệu sản phẩm"
      action={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm thương hiệu</Button>
      }
    >
      <Table<Brand>
        rowKey="id"
        columns={columns}
        dataSource={brands ?? []}
        loading={isLoading}
        pagination={{ pageSize: 20, showTotal: (t) => `Tổng ${t}` }}
        className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      />

      <Modal
        title={editing ? `Sửa: ${editing.name}` : 'Thêm thương hiệu'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? 'Lưu' : 'Thêm'}
        confirmLoading={createBrand.isPending || updateBrand.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item label="Tên thương hiệu" name="name" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input onChange={(e) => { if (!editing) form.setFieldValue('slug', slugify(e.target.value)); }} />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Nhập slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="URL Logo" name="logo_url"><Input placeholder="https://..." /></Form.Item>
          <Form.Item label="Website" name="website_url"><Input placeholder="https://..." /></Form.Item>
          <Form.Item label="Mô tả" name="description"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item label="Thứ tự" name="sort_order"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Hiển thị" name="is_active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  );
}
