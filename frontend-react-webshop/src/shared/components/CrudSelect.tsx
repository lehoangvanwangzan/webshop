import { useState, useRef } from 'react';
import { Select, Input, Button, Space, App, Divider, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { slugify } from '@shared/utils/slugify';

export interface CrudSelectOption {
  id: number;
  name: string;
  slug: string;
}

interface CrudSelectProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  options: CrudSelectOption[];
  placeholder?: string;
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small';
  onCreate: (name: string, slug: string) => Promise<void>;
  onEdit: (id: number, name: string, slug: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

type InlineMode = 'none' | 'add' | { id: number; name: string; slug: string };

export function CrudSelect({
  value,
  onChange,
  options,
  placeholder,
  allowClear,
  size = 'large',
  onCreate,
  onEdit,
  onDelete,
  loading,
  disabled,
}: CrudSelectProps) {
  const { modal, message } = App.useApp();
  const [inlineMode, setInlineMode] = useState<InlineMode>('none');
  const [inputName, setInputName] = useState('');
  const [inputSlug, setInputSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const slugManual = useRef(false);

  const resetInline = () => {
    setInlineMode('none');
    setInputName('');
    setInputSlug('');
    slugManual.current = false;
  };

  const handleNameChange = (v: string) => {
    setInputName(v);
    if (!slugManual.current) setInputSlug(slugify(v));
  };

  const handleConfirmAdd = async () => {
    if (!inputName.trim()) {
      message.warning('Vui lòng nhập tên');
      return;
    }
    setSubmitting(true);
    try {
      await onCreate(inputName.trim(), inputSlug.trim() || slugify(inputName.trim()));
      message.success('Đã thêm thành công');
      resetInline();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Có lỗi xảy ra';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmEdit = async () => {
    if (typeof inlineMode !== 'object') return;
    if (!inputName.trim()) {
      message.warning('Vui lòng nhập tên');
      return;
    }
    setSubmitting(true);
    try {
      await onEdit(
        inlineMode.id,
        inputName.trim(),
        inputSlug.trim() || slugify(inputName.trim()),
      );
      message.success('Đã cập nhật');
      resetInline();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Có lỗi xảy ra';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (opt: CrudSelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    modal.confirm({
      title: `Xoá "${opt.name}"?`,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await onDelete(opt.id);
          if (value === opt.id) onChange?.(undefined);
          message.success('Đã xoá');
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Xoá thất bại';
          message.error(msg);
        }
      },
    });
  };

  const handleEditClick = (opt: CrudSelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setInlineMode({ id: opt.id, name: opt.name, slug: opt.slug });
    setInputName(opt.name);
    setInputSlug(opt.slug);
    slugManual.current = true;
  };

  const isEditing = typeof inlineMode === 'object';
  const isAdding = inlineMode === 'add';
  const showInlineForm = isAdding || isEditing;

  // Mỗi option dùng React element làm label (hiện trong dropdown)
  // title là plain text dùng cho ô selected value (qua optionLabelProp="title")
  const selectOptions = options.map((o) => ({
    value: o.id,
    title: o.name,    // hiện trong ô đã chọn
    name: o.name,     // dùng cho filterOption
    label: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          width: '100%',
        }}
      >
        <span
          style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'rgba(0,0,0,0.88)',
          }}
        >
          {o.name}
        </span>
        <Space
          size={4}
          style={{ flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Sửa">
            <EditOutlined
              style={{ color: '#6b7280', fontSize: 13, cursor: 'pointer' }}
              onClick={(e) => handleEditClick(o, e)}
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <DeleteOutlined
              style={{ color: '#ef4444', fontSize: 13, cursor: 'pointer' }}
              onClick={(e) => handleDelete(o, e)}
            />
          </Tooltip>
        </Space>
      </div>
    ),
  }));

  const dropdownRender = (menu: React.ReactNode) => (
    <>
      {menu}
      <Divider style={{ margin: '4px 0' }} />
      {showInlineForm ? (
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Input
            size="small"
            placeholder="Tên"
            value={inputName}
            onChange={(e) => handleNameChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') isAdding ? handleConfirmAdd() : handleConfirmEdit();
              if (e.key === 'Escape') resetInline();
            }}
          />
          <Input
            size="small"
            placeholder="Slug (tự động)"
            value={inputSlug}
            onChange={(e) => {
              setInputSlug(e.target.value);
              slugManual.current = true;
            }}
          />
          <Space size={6}>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              loading={submitting}
              onClick={isAdding ? handleConfirmAdd : handleConfirmEdit}
            >
              {isAdding ? 'Thêm' : 'Lưu'}
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={resetInline}
              disabled={submitting}
            >
              Hủy
            </Button>
          </Space>
        </div>
      ) : (
        <div style={{ padding: '4px 8px' }}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            style={{ width: '100%', textAlign: 'left', color: '#2563eb' }}
            onClick={() => setInlineMode('add')}
          >
            Thêm mới
          </Button>
        </div>
      )}
    </>
  );

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      size={size}
      showSearch
      searchValue={searchValue}
      onSearch={setSearchValue}
      optionLabelProp="title"
      options={selectOptions}
      filterOption={(input, option) => {
        if (!input) return true;
        return (option?.name ?? '').toLowerCase().includes(input.toLowerCase());
      }}
      dropdownRender={dropdownRender}
      loading={loading}
      disabled={disabled}
      open={showInlineForm ? true : undefined}
    />
  );
}
