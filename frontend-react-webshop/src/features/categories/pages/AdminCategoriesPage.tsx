import { useState } from 'react';
import {
  Table, Button, Space, Tag, Popconfirm, App, Modal, Form, Input,
  InputNumber, Switch, Select, Tabs,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageLayout } from '@shared/components/PageLayout';
import {
  useCategories,
  useCreateCategory, useUpdateCategory, useDeleteCategory,
  useChildCategories,
  useCreateChildCategory, useUpdateChildCategory, useDeleteChildCategory,
} from '../hooks/useCategories';
import type { Category, ChildCategory } from '../types/categories.types';

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');
}

/* ─────────────── Category Tab ─────────────── */
function CategoriesTab() {
  const { data: categories, isLoading } = useCategories();
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    form.setFieldsValue({ ...cat });
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateCat.mutateAsync({ id: editing.id, payload: values });
        message.success('Đã cập nhật danh mục');
      } else {
        await createCat.mutateAsync(values);
        message.success('Đã thêm danh mục');
      }
      setModalOpen(false);
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? 'Lỗi, thử lại');
    }
  };

  const handleDelete = async (id: number) => {
    try { await deleteCat.mutateAsync(id); message.success('Đã xoá'); }
    catch { message.error('Xoá thất bại'); }
  };

  const flat = (categories ?? []).flatMap((c) => [c, ...(c.children ?? []).map((ch) => ({ ...ch, _parent: c.name }))]);

  const columns: ColumnsType<Category> = [
    { title: 'ID', dataIndex: 'id', width: 64, align: 'center', render: (id) => <span className="text-xs text-slate-400">#{id}</span> },
    { title: 'Tên', dataIndex: 'name', render: (name) => <strong>{name}</strong> },
    { title: 'Slug', dataIndex: 'slug', render: (s) => <code className="text-xs bg-slate-100 px-1 rounded">{s}</code> },
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
          <Popconfirm title="Xoá danh mục?" okText="Xoá" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm danh mục</Button>
      </div>
      <Table<Category>
        rowKey="id"
        columns={columns}
        dataSource={flat as any}
        loading={isLoading}
        pagination={{ pageSize: 20, showTotal: (t) => `Tổng ${t}` }}
        className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      />

      <Modal
        title={editing ? `Sửa: ${editing.name}` : 'Thêm danh mục'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? 'Lưu' : 'Thêm'}
        confirmLoading={createCat.isPending || updateCat.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input onChange={(e) => { if (!editing) form.setFieldValue('slug', slugify(e.target.value)); }} />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Nhập slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item label="URL ảnh" name="image_url"><Input /></Form.Item>
          <Form.Item label="Thứ tự" name="sort_order"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Hiển thị" name="is_active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

/* ─────────────── ChildCategory Tab ─────────────── */
function ChildCategoriesTab() {
  const { data: children, isLoading } = useChildCategories();
  const { data: categories } = useCategories();
  const createChild = useCreateChildCategory();
  const updateChild = useUpdateChildCategory();
  const deleteChild = useDeleteChildCategory();
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ChildCategory | null>(null);
  const [form] = Form.useForm();

  const catOptions = (categories ?? []).map((c) => ({ label: c.name, value: c.id }));

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (child: ChildCategory) => {
    setEditing(child);
    form.setFieldsValue({ ...child });
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateChild.mutateAsync({ id: editing.id, payload: values });
        message.success('Đã cập nhật');
      } else {
        await createChild.mutateAsync(values);
        message.success('Đã thêm');
      }
      setModalOpen(false);
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? 'Lỗi, thử lại');
    }
  };

  const handleDelete = async (id: number) => {
    try { await deleteChild.mutateAsync(id); message.success('Đã xoá'); }
    catch { message.error('Xoá thất bại'); }
  };

  const columns: ColumnsType<ChildCategory> = [
    { title: 'ID', dataIndex: 'id', width: 64, align: 'center', render: (id) => <span className="text-xs text-slate-400">#{id}</span> },
    { title: 'Tên', dataIndex: 'name', render: (name) => <strong>{name}</strong> },
    { title: 'Slug', dataIndex: 'slug', render: (s) => <code className="text-xs bg-slate-100 px-1 rounded">{s}</code> },
    {
      title: 'Danh mục cha', dataIndex: 'category_id', width: 160,
      render: (id) => {
        const cat = (categories ?? []).find((c) => c.id === id);
        return cat ? <Tag color="blue">{cat.name}</Tag> : `#${id}`;
      },
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
          <Popconfirm title="Xoá danh mục con?" okText="Xoá" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Thêm danh mục con</Button>
      </div>
      <Table<ChildCategory>
        rowKey="id"
        columns={columns}
        dataSource={children ?? []}
        loading={isLoading}
        pagination={{ pageSize: 20, showTotal: (t) => `Tổng ${t}` }}
        className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      />

      <Modal
        title={editing ? `Sửa: ${editing.name}` : 'Thêm danh mục con'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editing ? 'Lưu' : 'Thêm'}
        confirmLoading={createChild.isPending || updateChild.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item label="Danh mục cha" name="category_id" rules={[{ required: true, message: 'Chọn danh mục cha' }]}>
            <Select options={catOptions} placeholder="Chọn..." showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input onChange={(e) => { if (!editing) form.setFieldValue('slug', slugify(e.target.value)); }} />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Nhập slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="URL ảnh" name="image_url"><Input /></Form.Item>
          <Form.Item label="Thứ tự" name="sort_order"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Hiển thị" name="is_active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

/* ─────────────── Page ─────────────── */
export function AdminCategoriesPage() {
  return (
    <PageLayout title="Quản lý danh mục" subtitle="Danh mục cha và danh mục con">
      <Tabs
        defaultActiveKey="categories"
        items={[
          { key: 'categories', label: 'Danh mục cha', children: <CategoriesTab /> },
          { key: 'children', label: 'Danh mục con', children: <ChildCategoriesTab /> },
        ]}
      />
    </PageLayout>
  );
}
